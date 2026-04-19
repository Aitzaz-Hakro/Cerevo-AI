"use client"

import { signInWithGoogle } from "@/lib/auth-actions"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface SignInWithGoogleButtonProps {
  label?: string
  className?: string
}

const SignInWithGoogleButton = ({
  label = "Continue with Google",
  className,
}: SignInWithGoogleButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
    } catch (error) {
      setIsLoading(false)
      console.error("Google sign-in failed:", error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={cn(
        "w-full py-2.5 px-4 flex items-center justify-center gap-2 border border-border rounded-lg bg-background/70 hover:bg-accent/20 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
      )}
      <span className="font-medium">{isLoading ? "Redirecting..." : label}</span>
    </button>
  )
}

export default SignInWithGoogleButton