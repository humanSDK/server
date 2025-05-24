import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const token = await getToken({ req })

  if (!token?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.user.update({
    where: { id: token.userId },
    data: {
      isActive: false,
      lastLogoutAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}
