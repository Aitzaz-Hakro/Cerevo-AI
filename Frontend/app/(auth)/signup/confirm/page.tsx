"use client"

import { motion } from "framer-motion"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-[60vh] w-full flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Mail className="text-white" size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-6">
          We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.
        </p>
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            <strong>Didn't receive the email?</strong>
            <br />
            Check your spam folder or try signing up again.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </motion.div>
    </div>
  )
}
