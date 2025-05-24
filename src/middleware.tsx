import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuth = !!token

  const pathname = req.nextUrl.pathname

  // If user is authenticated and tries to access /signin or /register, redirect them
  if (isAuth && (pathname === "/signin" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url)) // redirect to homepage or dashboard
  }

  // If user is NOT authenticated and tries to access protected routes
  const protectedPaths:string[] = []
  const isProtected = protectedPaths.some(path => pathname === path )

  if (!isAuth && isProtected) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  return NextResponse.next()
}
export const config = {
    matcher: ["/((?!_next|api|static|.*\\..*).*)"], 
}