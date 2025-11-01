"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Moon, Sun, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    const darkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(darkMode)
    if (darkMode) document.documentElement.classList.add("dark")
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* logo*/}
          <Image src="/logo.png" alt="Cerevo Logo" width={200} height={200} />
                 </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary transition">
                Dashboard
              </Link>
              <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2  rounded-lg hover:opacity-90 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
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
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="block text-sm hover:text-primary">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-destructive hover:text-destructive/80"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm hover:text-primary">
                Login
              </Link>
              <Link href="/signup" className="block text-sm hover:text-primary">
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  )
}
