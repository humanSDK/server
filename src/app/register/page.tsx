"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_USER_MUTATION } from "@/graphql/mutations"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { User, Mail, Lock, Loader2 } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", name: "", password: "" })
  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await createUser({ variables: form })
      if (data?.createUser) {
        router.push("/signin")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={18} />
                </span>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail size={18} />
                </span>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={18} />
                </span>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error.message}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Registering...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="my-6">
            <Separator />
          </div>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
          Already have an account?
          <a href="/signin" className="ml-1 text-blue-600 hover:underline">
            Sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
