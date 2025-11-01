"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Briefcase, Target, BarChart3, Zap, BookOpen, ArrowRight, CheckCircle } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Resume Analyzer",
    description: "Get detailed analysis of your resume with actionable improvements",
  },
  {
    icon: Zap,
    title: "ATS Checker",
    description: "Optimize your resume for Applicant Tracking Systems",
  },
  {
    icon: BookOpen,
    title: "Resume Builder",
    description: "Create professional resumes with AI assistance",
  },
  {
    icon: Briefcase,
    title: "Job Recommendations",
    description: "Get personalized job recommendations based on your profile",
  },
  {
    icon: Target,
    title: "Job Matcher",
    description: "Find the perfect job matches using semantic search",
  },
  {
    icon: BarChart3,
    title: "Skill Gap Analysis",
    description: "Identify skills you need to develop for your target role",
  },
  {
    icon: BarChart3,
    title: "Job Market Dashboard",
    description: "Explore current job market trends and insights",
  },
  {
    icon: BookOpen,
    title: "MCQ Generator",
    description: "Practice with AI-generated interview questions",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Your AI-Powered <span className="gradient-primary-text">Career Guide</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Get personalized career guidance, resume optimization, and job recommendations powered by advanced AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:shadow-lg hover:border-primary/50 hover:bg-card/70 transition group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-teal-400/30 group-hover:to-blue-500/30 transition">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-32 bg-card/40 backdrop-blur-md border border-border/50 rounded-lg p-12"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Cerevo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI-Powered", description: "Advanced machine learning algorithms for accurate insights" },
              { title: "Comprehensive", description: "All-in-one platform for career development" },
              { title: "User-Friendly", description: "Intuitive interface designed for everyone" },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-4"
              >
                <CheckCircle className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </section>
    </main>
  )
}
