"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun, LogOut, User, Shield, Target, Briefcase, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utils/supabase/client"
import { signout } from "@/lib/auth-actions"
import BrandLogo from "@/components/BrandLogo"

// Navigation links
const navLinks = [
  { href: "/ats-checker", label: "ATS Checker", icon: Shield },
  { href: "/job-matcher", label: "Job Matcher", icon: Target },
  { href: "/portfolio-builder", label: "Portfolio Builder", icon: Briefcase },
  { href: "/resume-builder", label: "Resume Builder", icon: BookOpen },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  
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
    setIsOpen(false)
    await signout()
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
  const userAvatar = user?.user_metadata?.avatar_url || "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
  const userInitial = String(userName).charAt(0).toUpperCase()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (mobileMenuRef.current?.contains(target)) return
      if (mobileMenuButtonRef.current?.contains(target)) return
      setIsOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* logo*/}
          <BrandLogo width={180} height={180} className="w-auto h-10" priority />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/40 p-1 w-max ml-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm whitespace-nowrap transition ${
                      isActive
                        ? "bg-linear-to-r from-teal-400/20 to-blue-500/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <link.icon size={14} className="hidden xl:block" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition border border-border/50"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-card/50 border border-border/50 rounded-lg max-w-[180px]">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-linear-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {userInitial || <User size={16} />}
                    </div>
                  )}
                  <span className="text-sm font-medium truncate">{userName}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 px-3 xl:px-4 py-2 text-sm border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition px-2 py-1">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-linear-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:shadow-lg transition shadow-primary/20 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={mobileMenuButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg border border-border/50"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-nav-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-label="Close mobile menu backdrop"
            />

            <motion.div
              id="mobile-nav-menu"
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[4.6rem] left-3 right-3 z-50 lg:hidden bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 space-y-3 max-h-[calc(100vh-5.2rem)] overflow-y-auto"
            >
              {/* Service Links */}
              <div className="pb-3 mb-3 border-b border-border/50">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary py-2"
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
              </div>

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
                      <div className="w-10 h-10 bg-linear-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {userInitial || <User size={18} />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="w-full text-left text-sm hover:text-primary py-2 flex items-center gap-2"
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-destructive hover:text-destructive/80 py-2 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block text-sm hover:text-primary py-2">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-sm hover:text-primary py-2">
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
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
