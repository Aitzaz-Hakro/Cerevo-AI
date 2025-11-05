"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-[60vh] w-full flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="text-white" size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Successfully Logged Out</h1>
        <p className="text-muted-foreground mb-6">
          You have been logged out of your account.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" size={16} />
          <span>Redirecting to home page...</span>
        </div>
      </motion.div>
    </div>
  )
}

