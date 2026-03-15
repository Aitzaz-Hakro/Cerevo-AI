"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Briefcase, Target, BarChart3, Zap, BookOpen, MessageSquare, Home } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  // { href: "/dashboard/resume-analyzer", label: "Resume Analyzer", icon: FileText },
  { href: "/dashboard/ats-checker", label: "ATS Checker", icon: Zap },
  { href: "/dashboard/resume-builder", label: "Resume Builder", icon: BookOpen },
  // { href: "/dashboard/job-recommendation", label: "Job Recommendations", icon: Briefcase },
  { href: "/dashboard/job-matcher", label: "Job Matcher", icon: Target },
  // { href: "/dashboard/skill-gap", label: "Skill Gap", icon: BarChart3 },
  // { href: "/dashboard/job-market", label: "Job Market", icon: BarChart3 },
  // { href: "/dashboard/mcq-generator", label: "MCQ Generator", icon: BookOpen },
  // { href: "/dashboard/chatbot", label: "Chatbot", icon: MessageSquare },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-lg">Tools</h2>
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
                    ? "bg-gradient-to-r from-teal-400/20 to-blue-500/20 text-primary border border-primary/30"
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
