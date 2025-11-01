"use client"

import { motion } from "framer-motion"

interface SkillListProps {
  skills: string[]
  title?: string
}

export default function SkillList({ skills, title = "Skills" }: SkillListProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 py-1 bg-gradient-to-r from-teal-400/20 to-blue-500/20 text-sm rounded-full border border-teal-400/30"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
