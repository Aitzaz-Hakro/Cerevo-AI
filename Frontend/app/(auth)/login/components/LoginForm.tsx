"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Chrome , Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/auth-actions"
import SignInWithGoogleButton from "./SignInWithGoogleButton"
import Image from "next/image"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      await login(formData)
      // Force a full refresh to update auth state in header
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-lg p-8 mx-auto w-full sm:w-[90vw] md:w-[50vw] lg:w-[40vw]">
          <div className="text-center mb-8">
            <div className="w-16 h-16  rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Image
          src="/logo.png"
          alt="Cerevo Logo"
          width={100}
          height={100}
              />
              </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to Cerevo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
          <Mail
            className="absolute left-3 top-3 text-muted-foreground"
            size={20}
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Password</label>
          <Link
            href="#"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
              </div>
              <div className="relative">
          <Lock
            className="absolute left-3 top-3 text-muted-foreground"
            size={20}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
            <Eye
            className="absolute right-6 top-3 text-muted-foreground"
            size={20}
             />
              </div>
            </div>

            {error && (
              <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
              >
          {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <SignInWithGoogleButton />
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
