// app/page.tsx
"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    try {
      await fetch("/api/signout-extended", { method: "POST" })
      signOut()
    } catch (error) {
      console.log("Error logging out", error)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {session ? "Welcome Back!" : "Welcome to Our App"}
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col items-center justify-center gap-4 py-6">
          {status === "loading" ? (
            <div className="w-full space-y-2">
              <div className="h-4 w-1/2 mx-auto bg-gray-300 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ) : session ? (
            <>
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold">
                  {session.user?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-center text-sm">
                You are not signed in. Please log in to continue.
              </p>
              <Button className="w-full" onClick={() => signIn()}>
                Sign In
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
