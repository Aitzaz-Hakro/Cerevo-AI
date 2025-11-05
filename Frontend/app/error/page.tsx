"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-lg p-8">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
            <p className="text-muted-foreground">
              Something went wrong during authentication. Please check your credentials and try again.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-lg hover:bg-accent/10 transition"
            >
              <Home size={18} />
              Go Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  )
}