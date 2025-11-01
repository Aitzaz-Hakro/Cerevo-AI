"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ResultCardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  delay?: number
}

export default function ResultCard({ title, children, icon, delay = 0 }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
    >
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </motion.div>
  )
}
