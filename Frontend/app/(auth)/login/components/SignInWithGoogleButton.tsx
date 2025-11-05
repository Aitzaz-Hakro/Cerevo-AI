"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/lib/auth-actions"
import { Chrome } from "lucide-react"
import React from "react"

const SignInWithGoogleButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        signInWithGoogle()
      }}
      className="w-full py-2.5 flex items-center justify-center gap-2 border border-border rounded-lg hover:bg-accent/10 transition-all hover:scale-[1.02]"
    >
      <img 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google" 
        className="w-5 h-5" 
      />
      <span className="font-medium">Continue with Google</span>
    </button>
  )
}

export default SignInWithGoogleButton