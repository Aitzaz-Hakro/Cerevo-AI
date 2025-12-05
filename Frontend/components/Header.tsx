"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun, LogOut, User } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { signout } from "@/lib/auth-actions"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Create supabase client only once
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Check Supabase auth
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
    })

    // Theme
    const darkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(darkMode)
    if (darkMode) document.documentElement.classList.add("dark")

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem("darkMode", String(newDark))
    if (newDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLogout = async () => {
    // Clear user state immediately for instant UI feedback
    setUser(null)
    await signout()
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
  const userAvatar = user?.user_metadata?.avatar_url || "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* logo*/}
          <Image src="/logo.png" alt="Cerevo Logo" width={200} height={200} />
                 </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary transition">
                Dashboard
              </Link>
              <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-card/50 border border-border/50 rounded-lg">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition"
                  title="Logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-primary transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:shadow-lg transition"
              >
                Sign Up
              </Link>
              <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-card border-b border-border p-4 space-y-3"
        >
          {user ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-card/50 border border-border/50 rounded-lg mb-3">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link href="/dashboard" className="block text-sm hover:text-primary py-2">
                Dashboard
              </Link>
              <button
                onClick={toggleTheme}
                className="w-full text-left text-sm hover:text-primary py-2 flex items-center gap-2"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
              <Link href="handleLogout" >
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-destructive hover:text-destructive/80 py-2 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
              </Link>
              
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm hover:text-primary py-2">
                Login
              </Link>
              <Link href="/signup" className="block text-sm hover:text-primary py-2">
                Sign Up
              </Link>
              <button
                onClick={toggleTheme}
                className="w-full text-left text-sm hover:text-primary py-2 flex items-center gap-2"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </>
          )}
        </motion.div>
      )}
    </header>
  )
}
