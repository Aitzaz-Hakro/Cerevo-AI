// "use client"

// import type React from "react"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { buildResume } from "@/services/resumeBuilder"
// import DashboardNav from "@/components/DashboardNav"
// import { useApi } from "@/hooks/useApi"
// import { BookOpen, AlertCircle, Download } from "lucide-react"

// export default function ResumeBuilderPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     summary: "",
//     experience: "",
//     education: "",
//     skills: "",
//   })
//   const { data, loading, error, request } = useApi()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleGenerate = async () => {
//     if (!formData.name || !formData.email) {
//       alert("Please fill in required fields")
//       return
//     }

//     try {
//       await request("post", "/resume/build", formData)
//     } catch (err) {
//       console.error("Error generating resume:", err)
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardNav />
//       <main className="flex-1">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
//             <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
//             <p className="text-muted-foreground">Create a professional resume with AI assistance</p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-1">
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="bg-card border border-border rounded-lg p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto"
//               >
//                 <h2 className="font-semibold mb-4">Resume Details</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Full Name *</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       placeholder="John Doe"
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Email *</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="john@example.com"
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Phone</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       placeholder="+1 (555) 000-0000"
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Professional Summary</label>
//                     <textarea
//                       name="summary"
//                       value={formData.summary}
//                       onChange={handleInputChange}
//                       placeholder="Brief overview of your career..."
//                       rows={3}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Experience</label>
//                     <textarea
//                       name="experience"
//                       value={formData.experience}
//                       onChange={handleInputChange}
//                       placeholder="List your work experience..."
//                       rows={3}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Education</label>
//                     <textarea
//                       name="education"
//                       value={formData.education}
//                       onChange={handleInputChange}
//                       placeholder="List your education..."
//                       rows={3}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Skills</label>
//                     <textarea
//                       name="skills"
//                       value={formData.skills}
//                       onChange={handleInputChange}
//                       placeholder="List your skills (comma-separated)..."
//                       rows={3}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                     />
//                   </div>
//                   <button
//                     onClick={handleGenerate}
//                     disabled={loading}
//                     className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
//                   >
//                     {loading ? "Generating..." : "Generate Resume"}
//                   </button>
//                 </div>
//               </motion.div>
//             </div>

//             <div className="lg:col-span-2">
//               {loading && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
//                   <div className="inline-block">
//                     <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
//                   </div>
//                   <p className="mt-4 text-muted-foreground">Generating your resume...</p>
//                 </motion.div>
//               )}

//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3"
//                 >
//                   <AlertCircle className="text-destructive flex-shrink-0" size={20} />
//                   <div>
//                     <h3 className="font-semibold text-destructive">Error</h3>
//                     <p className="text-sm text-destructive/80">{error}</p>
//                   </div>
//                 </motion.div>
//               )}

//               {data && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//                   <div className="bg-card border border-border rounded-lg p-8">
//                     <div className="mb-8">
//                       <h2 className="text-2xl font-bold">{data.name}</h2>
//                       <p className="text-muted-foreground">
//                         {data.email} | {data.phone}
//                       </p>
//                     </div>

//                     {data.summary && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-2">Professional Summary</h3>
//                         <p className="text-sm text-muted-foreground">{data.summary}</p>
//                       </div>
//                     )}

//                     {data.experience && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-2">Experience</h3>
//                         <p className="text-sm whitespace-pre-wrap text-muted-foreground">{data.experience}</p>
//                       </div>
//                     )}

//                     {data.education && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-2">Education</h3>
//                         <p className="text-sm whitespace-pre-wrap text-muted-foreground">{data.education}</p>
//                       </div>
//                     )}

//                     {data.skills && (
//                       <div>
//                         <h3 className="font-semibold text-lg mb-2">Skills</h3>
//                         <div className="flex flex-wrap gap-2">
//                           {(typeof data.skills === "string" ? data.skills.split(",") : data.skills).map(
//                             (skill: string, index: number) => (
//                               <span key={index} className="px-3 py-1 bg-muted text-sm rounded-full">
//                                 {skill.trim()}
//                               </span>
//                             ),
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <button className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
//                     <Download size={20} />
//                     Download Resume
//                   </button>
//                 </motion.div>
//               )}

//               {!data && !loading && !error && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center py-12 bg-card border border-border rounded-lg"
//                 >
//                   <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
//                   <p className="text-muted-foreground">Fill in your details and generate your resume</p>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// // "use client"

// // import { useState } from "react"
// // import { motion } from "framer-motion"
// // import DashboardNav from "@/components/DashboardNav"
// // import { buildResume } from "@/services/resumeBuilder"
// // import { FileText } from "lucide-react"

// // export default function ResumeBuilderPage() {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     education: "",
// //     skills: [""],
// //     experience: [
// //       { role: "", company: "", duration: "", description: "" }
// //     ],
// //     achievements: [""],
// //   })

// //   const [loading, setLoading] = useState(false)
// //   const [message, setMessage] = useState("")

// //   // 🧠 Handle input changes
// //   const handleChange = (e: any) => {
// //     const { name, value } = e.target
// //     setFormData({ ...formData, [name]: value })
// //   }

// //   // 🧠 Handle skill, achievements, and experience updates
// //   const handleArrayChange = (index: number, field: string, value: string, section: string) => {
// //     const updated = [...formData[section]]
// //     if (section === "experience") updated[index][field] = value
// //     else updated[index] = value
// //     setFormData({ ...formData, [section]: updated })
// //   }

// //   // 🧠 Add more fields dynamically
// //   const addField = (section: string) => {
// //     const updated = [...formData[section]]
// //     if (section === "experience") updated.push({ role: "", company: "", duration: "", description: "" })
// //     else updated.push("")
// //     setFormData({ ...formData, [section]: updated })
// //   }

// //   // 🧠 Handle form submission
// //   const handleSubmit = async (e: any) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     setMessage("")

// //     const res = await buildResume(formData)
// //     setLoading(false)

// //     if (res.success) {
// //       setMessage("✅ Resume generated successfully! Check your Downloads.")
// //     } else {
// //       setMessage("❌ Error: " + res.message)
// //     }
// //   }

// //   return (
// //     <div className="flex min-h-screen bg-background">
// //       <DashboardNav />
// //       <main className="flex-1">
// //         <div className="max-w-5xl mx-auto px-6 py-12">
// //           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
// //             <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
// //             <p className="text-muted-foreground">Fill the form below to generate your professional AI-powered resume.</p>
// //           </motion.div>

// //           <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
// //             {/* Basic Info */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <input
// //                 type="text"
// //                 name="name"
// //                 placeholder="Full Name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //                 className="border p-2 rounded w-full"
// //                 required
// //               />
// //               <input
// //                 type="email"
// //                 name="email"
// //                 placeholder="Email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="border p-2 rounded w-full"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 name="phone"
// //                 placeholder="Phone"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //                 className="border p-2 rounded w-full"
// //                 required
// //               />
// //             </div>

// //             {/* Education */}
// //             <textarea
// //               name="education"
// //               placeholder="Education Details"
// //               value={formData.education}
// //               onChange={handleChange}
// //               className="border p-2 rounded w-full"
// //               required
// //             />

// //             {/* Skills */}
// //             <div>
// //               <h3 className="font-semibold mb-2">Skills</h3>
// //               {formData.skills.map((skill, i) => (
// //                 <input
// //                   key={i}
// //                   type="text"
// //                   value={skill}
// //                   onChange={(e) => handleArrayChange(i, "", e.target.value, "skills")}
// //                   placeholder={`Skill ${i + 1}`}
// //                   className="border p-2 rounded w-full mb-2"
// //                 />
// //               ))}
// //               <button
// //                 type="button"
// //                 onClick={() => addField("skills")}
// //                 className="text-primary hover:underline text-sm"
// //               >
// //                 + Add Skill
// //               </button>
// //             </div>

// //             {/* Experience */}
// //             <div>
// //               <h3 className="font-semibold mb-2">Experience</h3>
// //               {formData.experience.map((exp, i) => (
// //                 <div key={i} className="border p-3 rounded mb-3">
// //                   <input
// //                     type="text"
// //                     value={exp.role}
// //                     placeholder="Role"
// //                     onChange={(e) => handleArrayChange(i, "role", e.target.value, "experience")}
// //                     className="border p-2 rounded w-full mb-2"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={exp.company}
// //                     placeholder="Company"
// //                     onChange={(e) => handleArrayChange(i, "company", e.target.value, "experience")}
// //                     className="border p-2 rounded w-full mb-2"
// //                   />
// //                   <input
// //                     type="text"
// //                     value={exp.duration}
// //                     placeholder="Duration"
// //                     onChange={(e) => handleArrayChange(i, "duration", e.target.value, "experience")}
// //                     className="border p-2 rounded w-full mb-2"
// //                   />
// //                   <textarea
// //                     value={exp.description}
// //                     placeholder="Description"
// //                     onChange={(e) => handleArrayChange(i, "description", e.target.value, "experience")}
// //                     className="border p-2 rounded w-full"
// //                   />
// //                 </div>
// //               ))}
// //               <button
// //                 type="button"
// //                 onClick={() => addField("experience")}
// //                 className="text-primary hover:underline text-sm"
// //               >
// //                 + Add Experience
// //               </button>
// //             </div>

// //             {/* Achievements */}
// //             <div>
// //               <h3 className="font-semibold mb-2">Achievements</h3>
// //               {formData.achievements.map((ach, i) => (
// //                 <input
// //                   key={i}
// //                   type="text"
// //                   value={ach}
// //                   onChange={(e) => handleArrayChange(i, "", e.target.value, "achievements")}
// //                   placeholder={`Achievement ${i + 1}`}
// //                   className="border p-2 rounded w-full mb-2"
// //                 />
// //               ))}
// //               <button
// //                 type="button"
// //                 onClick={() => addField("achievements")}
// //                 className="text-primary hover:underline text-sm"
// //               >
// //                 + Add Achievement
// //               </button>
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
// //             >
// //               {loading ? "Generating..." : "Generate Resume"}
// //             </button>
// //           </form>

// //           {message && (
// //             <div className="mt-6 text-center">
// //               <p className={message.includes("✅") ? "text-green-600" : "text-red-600"}>{message}</p>
// //             </div>
// //           )}

// //           {!loading && !message && (
// //             <motion.div
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="text-center py-12 bg-card border border-border rounded-lg mt-6"
// //             >
// //               <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
// //               <p className="text-muted-foreground">Fill the form and click Generate Resume to download your AI Resume</p>
// //             </motion.div>
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }



// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import DashboardNav from "@/components/DashboardNav"
// import { FileText } from "lucide-react"

// // ✅ Type definitions
// interface Experience {
//   role: string
//   company: string
//   duration: string
//   description: string
// }

// interface FormDataType {
//   name: string
//   email: string
//   phone: string
//   education: string
//   skills: string[]
//   experience: Experience[]
//   achievements: string[]
// }


// type SectionKey = "skills" | "experience" | "achievements"

// export default function ResumeBuilderPage() {
//   const [formData, setFormData] = useState<FormDataType>({
//     name: "",
//     email: "",
//     phone: "",
//     education: "",
//     skills: [""],
//     experience: [{ role: "", company: "", duration: "", description: "" }],
//     achievements: [""],
//   })

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")

//   // 🧠 Handle single input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   // 🧠 Handle array field changes (skills, achievements, experience)
//   const handleArrayChange = (index: number, field: string, value: string, section: SectionKey) => {
//     const updated = [...formData[section]]
//     if (section === "experience") {
//       const expItem = { ...updated[index], [field]: value }
//       updated[index] = expItem
//     } else {
//       updated[index] = value
//     }
//     setFormData((prev) => ({ ...prev, [section]: updated }))
//   }

//   // 🧠 Add new field dynamically
//   const addField = (section: SectionKey) => {
//     const updated = [...formData[section]]
//     if (section === "experience") {
//       updated.push({ role: "", company: "", duration: "", description: "" })
//     } else {
//       updated.push("")
//     }
//     setFormData((prev) => ({ ...prev, [section]: updated }))
//   }

//   // 🧠 Submit and download PDF
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage("")

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/resume/build-resume`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) throw new Error("Failed to generate resume")

//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)

//       const a = document.createElement("a")
//       a.href = url
//       a.download = `${formData.name.replace(" ", "_")}_AI_Resume.pdf`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()

//       setMessage("✅ Resume generated successfully! Check your Downloads.")
//     } catch (err: any) {
//       console.error(err)
//       setMessage("❌ Error generating resume: " + err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 🧩 JSX Layout
//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardNav />
//       <main className="flex-1">
//         <div className="max-w-5xl mx-auto px-6 py-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-12"
//           >
//             <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
//             <p className="text-muted-foreground">
//               Generate your professional AI-enhanced resume in seconds
//             </p>
//           </motion.div>

//           <form
//             onSubmit={handleSubmit}
//             className="space-y-6 bg-card border border-border rounded-lg p-6"
//           >
//             {/* Basic Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 required
//               />
//             </div>

//             {/* Education */}
//             <textarea
//               name="education"
//               placeholder="Education Details"
//               value={formData.education}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               required
//             />

//             {/* Skills */}
//             <div>
//               <h3 className="font-semibold mb-2">Skills</h3>
//               {formData.skills.map((skill, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   value={skill}
//                   onChange={(e) =>
//                     handleArrayChange(i, "", e.target.value, "skills")
//                   }
//                   placeholder={`Skill ${i + 1}`}
//                   className="border p-2 rounded w-full mb-2"
//                 />
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addField("skills")}
//                 className="text-primary hover:underline text-sm"
//               >
//                 + Add Skill
//               </button>
//             </div>

//             {/* Experience */}
//             <div>
//               <h3 className="font-semibold mb-2">Experience</h3>
//               {formData.experience.map((exp, i) => (
//                 <div key={i} className="border p-3 rounded mb-3">
//                   <input
//                     type="text"
//                     value={exp.role}
//                     placeholder="Role"
//                     onChange={(e) =>
//                       handleArrayChange(i, "role", e.target.value, "experience")
//                     }
//                     className="border p-2 rounded w-full mb-2"
//                   />
//                   <input
//                     type="text"
//                     value={exp.company}
//                     placeholder="Company"
//                     onChange={(e) =>
//                       handleArrayChange(i, "company", e.target.value, "experience")
//                     }
//                     className="border p-2 rounded w-full mb-2"
//                   />
//                   <input
//                     type="text"
//                     value={exp.duration}
//                     placeholder="Duration"
//                     onChange={(e) =>
//                       handleArrayChange(i, "duration", e.target.value, "experience")
//                     }
//                     className="border p-2 rounded w-full mb-2"
//                   />
//                   <textarea
//                     value={exp.description}
//                     placeholder="Description"
//                     onChange={(e) =>
//                       handleArrayChange(i, "description", e.target.value, "experience")
//                     }
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addField("experience")}
//                 className="text-primary hover:underline text-sm"
//               >
//                 + Add Experience
//               </button>
//             </div>

//             {/* Achievements */}
//             <div>
//               <h3 className="font-semibold mb-2">Achievements</h3>
//               {formData.achievements.map((ach, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   value={ach}
//                   onChange={(e) =>
//                     handleArrayChange(i, "", e.target.value, "achievements")
//                   }
//                   placeholder={`Achievement ${i + 1}`}
//                   className="border p-2 rounded w-full mb-2"
//                 />
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addField("achievements")}
//                 className="text-primary hover:underline text-sm"
//               >
//                 + Add Achievement
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded font-semibold hover:shadow-lg transition"
//             >
//               {loading ? "Generating..." : "Generate Resume"}
//             </button>
//           </form>

//           {/* Status Message */}
//           {message && (
//             <div className="mt-6 text-center">
//               <p
//                 className={
//                   message.includes("✅") ? "text-green-600" : "text-red-600"
//                 }
//               >
//                 {message}
//               </p>
//             </div>
//           )}

//           {!loading && !message && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-12 bg-card border border-border rounded-lg mt-6"
//             >
//               <FileText
//                 className="mx-auto text-muted-foreground mb-4"
//                 size={48}
//               />
//               <p className="text-muted-foreground">
//                 Fill the form and click Generate Resume to download your AI
//                 Resume
//               </p>
//             </motion.div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import { FileText } from "lucide-react"

// ----------------- Types -----------------
interface Experience {
  role: string
  company: string
  duration: string
  description: string
}

interface FormDataType {
  name: string
  email: string
  phone: string
  education: string
  skills: string[]
  experience: Experience[]
  achievements: string[]
}

// keys used for simple string inputs
type SimpleField = "name" | "email" | "phone" | "education"

// valid array sections
type SectionKey = "skills" | "experience" | "achievements"

// ----------------- Component -----------------
export default function ResumeBuilderPage() {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: [""],
    experience: [{ role: "", company: "", duration: "", description: "" }],
    achievements: [""],
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // handle only the simple string fields (explicitly typed)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as SimpleField
    const value = e.target.value
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Update an item in skills / achievements arrays or a field inside an experience item.
   * - section must be one of "skills" | "experience" | "achievements"
   * - if section === "experience", 'field' must be keyof Experience
   * - for skills/achievements pass field = "" (ignored)
   */
  const handleArrayChange = (
    index: number,
    field: keyof Experience | "",
    value: string,
    section: SectionKey
  ) => {
    if (section === "experience") {
      // experience is Experience[]
      const updated = [...formData.experience]
      const item = { ...updated[index], [(field as keyof Experience)]: value } as Experience
      updated[index] = item
      setFormData((prev) => ({ ...prev, experience: updated }))
    } else if (section === "skills") {
      const updated = [...formData.skills]
      updated[index] = value
      setFormData((prev) => ({ ...prev, skills: updated }))
    } else {
      // achievements
      const updated = [...formData.achievements]
      updated[index] = value
      setFormData((prev) => ({ ...prev, achievements: updated }))
    }
  }

  // Add a new empty item to a section
  const addField = (section: SectionKey) => {
    if (section === "experience") {
      setFormData((prev) => ({ ...prev, experience: [...prev.experience, { role: "", company: "", duration: "", description: "" }] }))
    } else if (section === "skills") {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }))
    } else {
      setFormData((prev) => ({ ...prev, achievements: [...prev.achievements, ""] }))
    }
  }

  // Optional: remove a field (skills / achievements / experience)
  const removeField = (index: number, section: SectionKey) => {
    if (section === "experience") {
      setFormData((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }))
    } else if (section === "skills") {
      setFormData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
    } else {
      setFormData((prev) => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== index) }))
    }
  }

  // Submit form and download PDF
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Ensure environment variable exists; fallback to localhost
         const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"
         const response = await fetch(`${base}/api/v1/resume/build-resume`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
             })

      // const response = await fetch(`${base}/resume/build-resume`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })

      if (!response.ok) {
        // try to parse error message
        let detail = "Failed to generate resume"
        try {
          const j = await response.json()
          detail = j.detail || j.message || detail
        } catch {
          // ignore parse errors
        }
        throw new Error(detail)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.name ? formData.name.replace(/\s+/g, "_") : "resume"}_AI_Resume.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()

      setMessage("✅ Resume generated successfully! Check your Downloads.")
    } catch (err: any) {
      console.error(err)
      setMessage("❌ Error generating resume: " + (err?.message ?? String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
            <p className="text-muted-foreground">Generate your professional AI-enhanced resume in seconds</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            {/* Education */}
            <textarea
              name="education"
              placeholder="Education Details"
              value={formData.education}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              {formData.skills.map((skill, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(i, "", e.target.value, "skills")}
                    placeholder={`Skill ${i + 1}`}
                    className="border p-2 rounded w-full"
                  />
                  <button type="button" onClick={() => removeField(i, "skills")} className="text-sm text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addField("skills")} className="text-primary hover:underline text-sm">+ Add Skill</button>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              {formData.experience.map((exp, i) => (
                <div key={i} className="border p-3 rounded mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Experience #{i + 1}</strong>
                    <button type="button" onClick={() => removeField(i, "experience")} className="text-sm text-red-500">Remove</button>
                  </div>

                  <input
                    type="text"
                    value={exp.role}
                    placeholder="Role"
                    onChange={(e) => handleArrayChange(i, "role", e.target.value, "experience")}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    placeholder="Company"
                    onChange={(e) => handleArrayChange(i, "company", e.target.value, "experience")}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    placeholder="Duration"
                    onChange={(e) => handleArrayChange(i, "duration", e.target.value, "experience")}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <textarea
                    value={exp.description}
                    placeholder="Description"
                    onChange={(e) => handleArrayChange(i, "description", e.target.value, "experience")}
                    className="border p-2 rounded w-full"
                  />
                </div>
              ))}
              <button type="button" onClick={() => addField("experience")} className="text-primary hover:underline text-sm">+ Add Experience</button>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold mb-2">Achievements</h3>
              {formData.achievements.map((ach, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => handleArrayChange(i, "", e.target.value, "achievements")}
                    placeholder={`Achievement ${i + 1}`}
                    className="border p-2 rounded w-full"
                  />
                  <button type="button" onClick={() => removeField(i, "achievements")} className="text-sm text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addField("achievements")} className="text-primary hover:underline text-sm">+ Add Achievement</button>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded font-semibold hover:shadow-lg transition">
              {loading ? "Generating..." : "Generate Resume"}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div className="mt-6 text-center">
              <p className={message.includes("✅") ? "text-green-600" : "text-red-600"}>{message}</p>
            </div>
          )}

          {!loading && !message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-card border border-border rounded-lg mt-6">
              <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">Fill the form and click Generate Resume to download your AI Resume</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
