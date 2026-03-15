"use client"

import Team from "@/components/Team"
import CTA from "@/components/CTA"
import About from "@/components/About"
import Features from "@/components/Features"
import Hero from "@/components/Hero"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText,
  Briefcase,
  Target,
  BarChart3,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const features = [
  { icon: FileText, title: "Resume Analyzer", description: "Upload your resume and let AI uncover strengths, weaknesses, and actionable insights to make your profile stand out." },
  { icon: Zap, title: "ATS Checker", description: "Ensure your resume passes Applicant Tracking Systems used by top employers with our advanced ATS resume checker." },
  { icon: BookOpen, title: "AI Resume Builder", description: "Create recruiter-ready resumes instantly, powered by real hiring data and personalized AI suggestions." },
  { icon: Briefcase, title: "Job Recommendations", description: "Get AI-powered job matches aligned with your experience, goals, and skills — updated in real time." },
  { icon: Target, title: "Job Matcher", description: "Compare your resume with job descriptions and see exactly how you align using ML-powered matching." },
  { icon: BarChart3, title: "Skill Gap Analysis", description: "Discover which skills to improve and how to grow faster in your career path." },
  { icon: BarChart3, title: "Job Market Insights", description: "Explore live job market trends, salary benchmarks, and growth analytics." },
  { icon: BookOpen, title: "MCQ Generator", description: "Practice AI-generated interview questions tailored to your target role." },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center space-y-20">
        {/* About Section */}
        <section>
          <About />
        </section>

        {/* Features Grid */}
        <section>
          <Features />
        </section>

        {/* CTA Section */}
        <section>
          <CTA />
        </section>

        <section>
          <Team />
        </section>
      </section>
    </main>
  )
}
