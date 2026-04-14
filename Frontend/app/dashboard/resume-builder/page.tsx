"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  RefreshCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react"
import DashboardNav from "@/components/DashboardNav"
import apiClient from "@/lib/apiClient"

type BuilderStage = "template" | "workspace"

type ExperienceItem = {
  role: string
  company: string
  duration: string
  description: string
}

type ResumeContent = {
  name: string
  email: string
  phone: string
  education: string
  skills: string[]
  experience: ExperienceItem[]
  achievements: string[]
}

type ResumeTemplate = {
  id: string
  name: string
  tagline: string
  tone: "light" | "dark"
  accent: string
  content: ResumeContent
}

const emptyExperience: ExperienceItem = {
  role: "",
  company: "",
  duration: "",
  description: "",
}

const resumeTemplates: ResumeTemplate[] = [
  {
    id: "executive-edge",
    name: "Executive Edge",
    tagline: "Strong summary with impact-first achievements",
    tone: "light",
    accent: "from-emerald-500 to-cyan-500",
    content: {
      name: "Aitzaz Hakro",
      email: "you@example.com",
      phone: "+1 000 000 0000",
      education: "BS Computer Science, XYZ University, 2024",
      skills: ["Leadership", "Product Strategy", "Stakeholder Management"],
      experience: [
        {
          role: "Product Manager",
          company: "Cerevo AI",
          duration: "2024 - Present",
          description: "Led cross-functional AI product delivery from concept to launch.",
        },
      ],
      achievements: [
        "Increased product adoption by 35% in 6 months",
        "Built roadmap adopted by 3 teams",
      ],
    },
  },
  {
    id: "tech-minimal",
    name: "Tech Minimal",
    tagline: "Clean sections for engineers and developers",
    tone: "dark",
    accent: "from-indigo-500 to-violet-500",
    content: {
      name: "Aitzaz Hakro",
      email: "you@example.com",
      phone: "+1 000 000 0000",
      education: "BS Software Engineering, ABC Institute, 2025",
      skills: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL"],
      experience: [
        {
          role: "Full Stack Developer",
          company: "Freelance",
          duration: "2023 - Present",
          description: "Built full-stack web products and automation tools for clients.",
        },
      ],
      achievements: [
        "Shipped 12+ production features",
        "Improved page performance score from 68 to 95",
      ],
    },
  },
  {
    id: "creative-story",
    name: "Creative Story",
    tagline: "Narrative flow for design and portfolio profiles",
    tone: "light",
    accent: "from-amber-500 to-orange-500",
    content: {
      name: "Aitzaz Hakro",
      email: "you@example.com",
      phone: "+1 000 000 0000",
      education: "BDes, Design School, 2023",
      skills: ["UI Design", "Figma", "Design Systems", "Brand Storytelling"],
      experience: [
        {
          role: "UI/UX Designer",
          company: "Studio Pixel",
          duration: "2022 - Present",
          description: "Designed conversion-focused interfaces and scalable design systems.",
        },
      ],
      achievements: [
        "Redesigned onboarding and cut drop-off by 28%",
        "Created design system reused across 5 products",
      ],
    },
  },
  {
    id: "startup-velocity",
    name: "Startup Velocity",
    tagline: "Compact layout for fast-moving startup candidates",
    tone: "dark",
    accent: "from-teal-500 to-blue-500",
    content: {
      name: "Aitzaz Hakro",
      email: "you@example.com",
      phone: "+1 000 000 0000",
      education: "BS Information Technology, LMN University, 2024",
      skills: ["Growth", "Automation", "Analytics", "Problem Solving"],
      experience: [
        {
          role: "Growth Engineer",
          company: "LaunchLab",
          duration: "2024 - Present",
          description: "Automated funnels and analytics to improve activation and retention.",
        },
      ],
      achievements: [
        "Drove 22% activation uplift through experiments",
        "Reduced manual reporting effort by 10 hours/week",
      ],
    },
  },
]

function cloneResumeContent(content: ResumeContent): ResumeContent {
  return {
    ...content,
    skills: [...content.skills],
    achievements: [...content.achievements],
    experience: content.experience.map((item) => ({ ...item })),
  }
}

function renderResumePreview(content: ResumeContent, template: ResumeTemplate): string {
  const textColor = template.tone === "dark" ? "#f3f4f6" : "#0f172a"
  const mutedColor = template.tone === "dark" ? "#cbd5e1" : "#475569"
  const surface = template.tone === "dark" ? "#0f172a" : "#f8fafc"
  const card = template.tone === "dark" ? "#111827" : "#ffffff"

  const skillsMarkup = content.skills
    .filter((item) => item.trim().length > 0)
    .map(
      (item) =>
        `<span style="display:inline-block;margin:4px;padding:6px 10px;border-radius:999px;background:rgba(14,165,233,.12);font-size:12px;">${item}</span>`,
    )
    .join("")

  const experienceMarkup = content.experience
    .filter((item) => item.role.trim() || item.company.trim() || item.description.trim())
    .map(
      (item) => `
        <div style="margin-bottom:14px;">
          <p style="margin:0;font-weight:600;">${item.role || "Role"} - ${item.company || "Company"}</p>
          <p style="margin:4px 0 6px;color:${mutedColor};font-size:13px;">${item.duration || "Duration"}</p>
          <p style="margin:0;color:${mutedColor};line-height:1.5;">${item.description || "Description"}</p>
        </div>
      `,
    )
    .join("")

  const achievementsMarkup = content.achievements
    .filter((item) => item.trim().length > 0)
    .map((item) => `<li style="margin-bottom:6px;">${item}</li>`)
    .join("")

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { margin: 0; font-family: "Segoe UI", sans-serif; background: ${surface}; color: ${textColor}; }
          .page { max-width: 780px; margin: 0 auto; padding: 28px 20px; }
          .hero { padding: 18px 20px; border-radius: 14px; background: linear-gradient(120deg, rgba(16,185,129,.18), rgba(6,182,212,.18)); border: 1px solid rgba(148,163,184,.3); }
          .card { margin-top: 14px; padding: 16px; border-radius: 14px; background: ${card}; border: 1px solid rgba(148,163,184,.28); }
          h1 { margin: 0; font-size: 28px; }
          h2 { margin: 0 0 8px; font-size: 15px; letter-spacing: .4px; text-transform: uppercase; }
          p, li { font-size: 14px; }
          ul { margin: 0; padding-left: 18px; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="hero">
            <h1>${content.name || "Your Name"}</h1>
            <p style="margin:8px 0 0;color:${mutedColor};">${content.email || "you@example.com"} | ${content.phone || "phone"}</p>
          </div>

          <div class="card">
            <h2>Education</h2>
            <p style="margin:0;color:${mutedColor};line-height:1.5;">${content.education || "Education details"}</p>
          </div>

          <div class="card">
            <h2>Skills</h2>
            <div>${skillsMarkup || `<p style="margin:0;color:${mutedColor};">Add skills to populate this section.</p>`}</div>
          </div>

          <div class="card">
            <h2>Experience</h2>
            ${experienceMarkup || `<p style="margin:0;color:${mutedColor};">Add experience details.</p>`}
          </div>

          <div class="card">
            <h2>Achievements</h2>
            <ul>${achievementsMarkup || `<li style="color:${mutedColor};">Add achievements.</li>`}</ul>
          </div>
        </div>
      </body>
    </html>
  `
}

export default function ResumeBuilderPage() {
  const [stage, setStage] = useState<BuilderStage>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null)
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const previewMarkup = useMemo(() => {
    if (!resumeContent || !selectedTemplate) {
      return ""
    }
    return renderResumePreview(resumeContent, selectedTemplate)
  }, [resumeContent, selectedTemplate])

  const isReadyToDownload = useMemo(() => {
    if (!resumeContent) {
      return false
    }

    const hasIdentity =
      resumeContent.name.trim().length > 0 &&
      resumeContent.email.trim().length > 0 &&
      resumeContent.phone.trim().length > 0

    return hasIdentity
  }, [resumeContent])

  const selectTemplate = (template: ResumeTemplate) => {
    setSelectedTemplate(template)
    setResumeContent(cloneResumeContent(template.content))
    setStage("workspace")
    setError(null)
    setMessage(null)
  }

  const backToTemplates = () => {
    setStage("template")
    setError(null)
    setMessage(null)
  }

  const resetTemplate = () => {
    if (!selectedTemplate) {
      return
    }
    setResumeContent(cloneResumeContent(selectedTemplate.content))
    setError(null)
    setMessage("Template reset to default content.")
  }

  const updateBasicField = (field: keyof Omit<ResumeContent, "skills" | "experience" | "achievements">, value: string) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      return { ...prev, [field]: value }
    })
  }

  const updateSkill = (index: number, value: string) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      const updated = [...prev.skills]
      updated[index] = value
      return { ...prev, skills: updated }
    })
  }

  const addSkill = () => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      return { ...prev, skills: [...prev.skills, ""] }
    })
  }

  const removeSkill = (index: number) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      const updated = prev.skills.filter((_, i) => i !== index)
      return { ...prev, skills: updated.length ? updated : [""] }
    })
  }

  const updateAchievement = (index: number, value: string) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      const updated = [...prev.achievements]
      updated[index] = value
      return { ...prev, achievements: updated }
    })
  }

  const addAchievement = () => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      return { ...prev, achievements: [...prev.achievements, ""] }
    })
  }

  const removeAchievement = (index: number) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      const updated = prev.achievements.filter((_, i) => i !== index)
      return { ...prev, achievements: updated.length ? updated : [""] }
    })
  }

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      const updated = [...prev.experience]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, experience: updated }
    })
  }

  const addExperience = () => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      return { ...prev, experience: [...prev.experience, { ...emptyExperience }] }
    })
  }

  const removeExperience = (index: number) => {
    setResumeContent((prev) => {
      if (!prev) {
        return prev
      }
      const updated = prev.experience.filter((_, i) => i !== index)
      return {
        ...prev,
        experience: updated.length ? updated : [{ ...emptyExperience }],
      }
    })
  }

  const optimizeContent = async () => {
    if (!resumeContent || !selectedTemplate) {
      return
    }

    setIsOptimizing(true)
    setError(null)
    setMessage(null)

    try {
      const endpoint = process.env.NEXT_PUBLIC_RESUME_OPTIMIZE_ENDPOINT || "/api/v1/resume/optimize-content"

      const response = await apiClient.post(endpoint, {
        template_id: selectedTemplate.id,
        content: resumeContent,
      })

      const optimized = response?.data?.optimized_content as ResumeContent | undefined
      if (!optimized) {
        throw new Error("Optimize endpoint did not return optimized_content.")
      }

      setResumeContent({
        ...optimized,
        skills: optimized.skills?.length ? optimized.skills : [""],
        achievements: optimized.achievements?.length ? optimized.achievements : [""],
        experience: optimized.experience?.length
          ? optimized.experience
          : [{ ...emptyExperience }],
      })

      setMessage(response?.data?.message || "Resume content optimized successfully.")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to optimize content.")
    } finally {
      setIsOptimizing(false)
    }
  }

  const downloadResume = async () => {
    if (!resumeContent) {
      return
    }

    setIsDownloading(true)
    setError(null)
    setMessage(null)

    try {
      const endpoint = process.env.NEXT_PUBLIC_RESUME_BUILD_ENDPOINT || "/api/v1/resume/build-resume"
      const response = await apiClient.post(endpoint, resumeContent, { responseType: "blob" })

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${resumeContent.name.trim().replace(/\s+/g, "_") || "resume"}_AI_Resume.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)

      setMessage("Resume downloaded successfully.")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to download resume.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="flex-1">
        <div className="absolute inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-500/15 via-cyan-500/5 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {stage === "template" && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur sm:p-10">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
                    <Sparkles size={14} />
                    Resume Builder
                  </div>
                  <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                    Start by selecting a template
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    No question flow. Pick a template, edit content directly, optimize via API, and download your resume.
                  </p>
                </div>
              </div>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold sm:text-2xl">Resume Templates</h2>
                  <p className="text-xs text-muted-foreground sm:text-sm">Choose one to start editing immediately.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {resumeTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => selectTemplate(template)}
                      className="group rounded-2xl border border-border/70 bg-card p-4 text-left transition hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/10"
                    >
                      <div className={`h-28 rounded-xl bg-linear-to-br ${template.accent} p-px`}>
                        <div className={`h-full rounded-[11px] ${template.tone === "dark" ? "bg-zinc-950" : "bg-white"}`}>
                          <div className="flex h-full items-end p-3">
                            <div className="h-2 w-24 rounded bg-white/40" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-medium">{template.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{template.tagline}</p>
                      <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-300">Use Template</p>
                    </button>
                  ))}
                </div>
              </section>
            </motion.section>
          )}

          {stage === "workspace" && selectedTemplate && resumeContent && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/70 p-4">
                <div>
                  <h2 className="text-lg font-semibold sm:text-xl">{selectedTemplate.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    Template editing workspace with direct optimize and download actions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={backToTemplates}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted"
                  >
                    <ArrowLeft size={14} /> Change Template
                  </button>
                  <button
                    onClick={resetTemplate}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted"
                  >
                    <RefreshCcw size={14} /> Reset Template
                  </button>
                </div>
              </div>

              {(message || error) && (
                <div className="mb-4 space-y-2">
                  {message && (
                    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 size={14} /> {message}
                      </span>
                    </p>
                  )}
                  {error && (
                    <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
                      {error}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-border/80 bg-card/70 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <WandSparkles size={15} className="text-emerald-500" />
                    Edit Template Content
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        value={resumeContent.name}
                        onChange={(event) => updateBasicField("name", event.target.value)}
                        placeholder="Full name"
                        className="h-11 rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <input
                        value={resumeContent.email}
                        onChange={(event) => updateBasicField("email", event.target.value)}
                        placeholder="Email"
                        type="email"
                        className="h-11 rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <input
                        value={resumeContent.phone}
                        onChange={(event) => updateBasicField("phone", event.target.value)}
                        placeholder="Phone"
                        className="h-11 rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 sm:col-span-2"
                      />
                    </div>

                    <textarea
                      value={resumeContent.education}
                      onChange={(event) => updateBasicField("education", event.target.value)}
                      placeholder="Education"
                      rows={3}
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                    />

                    <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Skills</p>
                        <button type="button" onClick={addSkill} className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                          + Add skill
                        </button>
                      </div>
                      <div className="space-y-2">
                        {resumeContent.skills.map((skill, index) => (
                          <div key={`skill-${index}`} className="flex gap-2">
                            <input
                              value={skill}
                              onChange={(event) => updateSkill(index, event.target.value)}
                              placeholder={`Skill ${index + 1}`}
                              className="h-10 flex-1 rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60"
                            />
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="rounded-lg border border-border px-3 text-xs transition hover:bg-muted"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Experience</p>
                        <button
                          type="button"
                          onClick={addExperience}
                          className="text-xs font-medium text-emerald-600 dark:text-emerald-300"
                        >
                          + Add experience
                        </button>
                      </div>

                      <div className="space-y-3">
                        {resumeContent.experience.map((item, index) => (
                          <div key={`exp-${index}`} className="rounded-lg border border-border/80 bg-background p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-semibold text-muted-foreground">Experience {index + 1}</p>
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="text-xs transition hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <input
                                value={item.role}
                                onChange={(event) => updateExperience(index, "role", event.target.value)}
                                placeholder="Role"
                                className="h-10 rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60"
                              />
                              <input
                                value={item.company}
                                onChange={(event) => updateExperience(index, "company", event.target.value)}
                                placeholder="Company"
                                className="h-10 rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60"
                              />
                              <input
                                value={item.duration}
                                onChange={(event) => updateExperience(index, "duration", event.target.value)}
                                placeholder="Duration"
                                className="h-10 rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60 sm:col-span-2"
                              />
                              <textarea
                                value={item.description}
                                onChange={(event) => updateExperience(index, "description", event.target.value)}
                                placeholder="Description"
                                rows={3}
                                className="rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none transition focus:border-emerald-500/60 sm:col-span-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Achievements</p>
                        <button
                          type="button"
                          onClick={addAchievement}
                          className="text-xs font-medium text-emerald-600 dark:text-emerald-300"
                        >
                          + Add achievement
                        </button>
                      </div>
                      <div className="space-y-2">
                        {resumeContent.achievements.map((item, index) => (
                          <div key={`ach-${index}`} className="flex gap-2">
                            <input
                              value={item}
                              onChange={(event) => updateAchievement(index, event.target.value)}
                              placeholder={`Achievement ${index + 1}`}
                              className="h-10 flex-1 rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-emerald-500/60"
                            />
                            <button
                              type="button"
                              onClick={() => removeAchievement(index)}
                              className="rounded-lg border border-border px-3 text-xs transition hover:bg-muted"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">Live Resume Preview</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={optimizeContent}
                        disabled={isOptimizing}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <WandSparkles size={14} />
                        {isOptimizing ? "Optimizing..." : "Optimize Content"}
                      </button>
                      <button
                        onClick={downloadResume}
                        disabled={!isReadyToDownload || isDownloading}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-4 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Download size={14} />
                        {isDownloading ? "Downloading..." : "Download Resume"}
                      </button>
                    </div>
                  </div>

                  {!isReadyToDownload && (
                    <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                      Add at least name, email, and phone before downloading.
                    </p>
                  )}

                  <div className="mb-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="ml-1">Template Preview Window</span>
                  </div>

                  <div className="h-[760px] overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                    <iframe srcDoc={previewMarkup} title="Resume Preview" className="h-full w-full" />
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </main>
    </div>
  )
}
