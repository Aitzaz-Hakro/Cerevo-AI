"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import { FileText, Briefcase, Target, BarChart3, Zap, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { signout } from "@/lib/auth-actions"

const tools = [
  // {
  //   href: "/dashboard/resume-analyzer",
  //   icon: FileText,
  //   title: "Resume Analyzer",
  //   description: "Get detailed analysis of your resume",
  //   color: "from-blue-400 to-blue-600",
  // },
  {
    href: "/dashboard/ats-checker",
    icon: Zap,
    title: "ATS Checker",
    description: "Optimize for Applicant Tracking Systems",
    color: "from-yellow-400 to-orange-600",
  },
  {
    href: "/dashboard/resume-builder",
    icon: BookOpen,
    title: "Resume Builder",
    description: "Create professional resumes",
    color: "from-green-400 to-green-600",
  },
  // {
  //   href: "/dashboard/job-recommendation",
  //   icon: Briefcase,
  //   title: "Job Recommendations",
  //   description: "Get personalized job matches",
  //   color: "from-purple-400 to-purple-600",
  // },
  {
    href: "/dashboard/job-matcher",
    icon: Target,
    title: "Job Matcher",
    description: "Find perfect job matches",
    color: "from-pink-400 to-pink-600",
  },
  // {
  //   href: "/dashboard/skill-gap",
  //   icon: BarChart3,
  //   title: "Skill Gap Analysis",
  //   description: "Identify skills to develop",
  //   color: "from-indigo-400 to-indigo-600",
  // },
  // {
  //   href: "/dashboard/job-market",
  //   icon: BarChart3,
  //   title: "Job Market Dashboard",
  //   description: "Explore market trends",
  // color: "from-cyan-400 to-cyan-600",
  // },
  // {
  //   href: "/dashboard/mcq-generator",
  //   icon: BookOpen,
  //   title: "MCQ Generator",
  //   description: "Practice interview questions",
  //   color: "from-red-400 to-red-600",
  // },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    )
  }

  if (!user) return null

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || "User"
  const userEmail = user.email || ""
  const userImage = user.user_metadata?.avatar_url

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName} </h1>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>

          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={tool.href}>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:shadow-lg hover:border-primary/50 hover:bg-card/70 transition group h-full cursor-pointer">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                      <div className="flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                        Open <ArrowRight size={16} className="ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
