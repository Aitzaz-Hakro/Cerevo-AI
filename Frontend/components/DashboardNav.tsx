"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Target, Zap, BookOpen, Home, Briefcase } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ats-checker", label: "ATS Checker", icon: Zap },
  { href: "/job-matcher", label: "Job Matcher", icon: Target },
  { href: "/portfolio-builder", label: "Portfolio Builder", icon: Briefcase },
  { href: "/resume-builder", label: "Resume Builder", icon: BookOpen },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-lg">Services</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-linear-to-r from-teal-400/20 to-blue-500/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
