"use client"

import { SessionProvider } from "next-auth/react"
import { Apollo } from "@/lib/apollo"
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Apollo>
        {children}
      </Apollo>
    </SessionProvider>
  )
}