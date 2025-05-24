import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = new URLSearchParams({
    client_id: process.env.INTEGRATIONS_GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.BASE_URL}/api/integrations/github/callback`,
    scope: "read:user repo admin:org",
    allow_signup: "false",
  });

  console.log("params", params.toString());
  const githubOAuthURL = `https://github.com/login/oauth/authorize?${params.toString()}`;

  return NextResponse.json({ url: githubOAuthURL });
}
