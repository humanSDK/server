import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code from GitHub" }, { status: 400 });
  }

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.INTEGRATIONS_GITHUB_CLIENT_ID!,
        client_secret: process.env.INTEGRATIONS_GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: "GitHub token fetch failed" }, { status: 400 });
    }

    // Step 2: Get GitHub user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const githubUser = await userRes.json();
    if (!githubUser?.login) {
      return NextResponse.json({ error: "Invalid GitHub user" }, { status: 400 });
    }


    // Step 3: Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 4: Store integration
    await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "github",
        },
      },
      update: {
        accessToken,
        providerUserId: githubUser.login,
        connectedAt: new Date(),
      },
      create: {
        userId: user.id,
        provider: "github",
        accessToken,
        providerUserId: githubUser.login,
      },
    });

    return NextResponse.redirect(new URL("/console", req.url));
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
