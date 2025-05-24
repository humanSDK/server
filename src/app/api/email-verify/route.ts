import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verifyToken: null },
  });

  return NextResponse.redirect(new URL("/signin", req.url));
}
