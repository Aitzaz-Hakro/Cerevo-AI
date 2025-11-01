// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import DashboardNav from "@/components/DashboardNav"
// import FileUploader from "@/components/FileUploader"
// import { useApi } from "@/hooks/useApi"
// import { Target, AlertCircle } from "lucide-react"

// export default function JobMatcherPage() {
//   const [files, setFiles] = useState<File[]>([])
//   const [jobDescription, setJobDescription] = useState("")
//   const { data, loading, error, request } = useApi()

//   const handleFileSelect = (file: File) => {
//     setFiles((prev) => [...prev, file])
//   }

//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleFindMatches = async () => {
//     if (files.length === 0 || !jobDescription.trim()) {
//       alert("Please upload at least one resume and enter a job description")
//       return
//     }

//     const formData = new FormData()
//     files.forEach((file) => {
//       formData.append("files", file)
//     })
//     formData.append("job_description", jobDescription)

//     try {
//       await request("post", "/api/v1/job-matcher/semantic-match", formData,  {
//         headers: { "Content-Type": "multipart/form-data" },
//        })} 
//         catch (err) {
//       console.error("Error matching jobs:", err)
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardNav />
//       <main className="flex-1">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
//             <h1 className="text-3xl font-bold mb-2">Job Matcher</h1>
//             <p className="text-muted-foreground">Match multiple resumes against a job description</p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-1">
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="bg-card border border-border rounded-lg p-6 sticky top-24"
//               >
//                 <h2 className="font-semibold mb-4">Upload Resumes</h2>
//                 <div className="space-y-4">
//                   <FileUploader onFileSelect={handleFileSelect} label="Upload resumes" />

//                   {files.length > 0 && (
//                     <div className="space-y-2">
//                       {files.map((file, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="p-3 bg-muted rounded-lg flex items-center justify-between"
//                         >
//                           <span className="text-sm font-medium truncate">{file.name}</span>
//                           <button
//                             onClick={() => removeFile(index)}
//                             className="text-destructive hover:bg-destructive/10 p-1 rounded transition"
//                           >
//                             ✕
//                           </button>
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Job Description</label>
//                     <textarea
//                       value={jobDescription}
//                       onChange={(e) => setJobDescription(e.target.value)}
//                       placeholder="Paste job description here…"
//                       rows={6}
//                       className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
//                     />
//                   </div>

//                   <button
//                     onClick={handleFindMatches}
//                     disabled={loading || files.length === 0 || !jobDescription.trim()}
//                     className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
//                   >
//                     {loading ? "Matching..." : "Find Matches"}
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
//                   <p className="mt-4 text-muted-foreground">Matching resumes...</p>
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

//               {data && data.results && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-border">
//                           <th className="text-left py-3 px-4 font-semibold">Resume</th>
//                           <th className="text-left py-3 px-4 font-semibold">Semantic Match</th>
//                           <th className="text-left py-3 px-4 font-semibold">Skill Match</th>
//                           <th className="text-left py-3 px-4 font-semibold">Missing Skills</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {data.matches.map((match: any, index: number) => (
//                           <motion.tr
//                             key={index}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.05 }}
//                             className="border-b border-border hover:bg-muted/50 transition"
//                           >
//                             <td className="py-3 px-4 font-medium">{match.resume_name}</td>
//                             <td className="py-3 px-4">
//                               <div className="flex items-center gap-2">
//                                 <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden max-w-xs">
//                                   <motion.div
//                                     initial={{ width: 0 }}
//                                     animate={{ width: `${match.semantic_match}%` }}
//                                     transition={{ duration: 0.8, delay: index * 0.1 }}
//                                     className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
//                                   />
//                                 </div>
//                                 <span className="font-semibold text-sm">{match.semantic_match}%</span>
//                               </div>
//                             </td>
//                             <td className="py-3 px-4">
//                               <div className="flex items-center gap-2">
//                                 <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden max-w-xs">
//                                   <motion.div
//                                     initial={{ width: 0 }}
//                                     animate={{ width: `${match.skill_match}%` }}
//                                     transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
//                                     className="h-full bg-gradient-to-r from-green-400 to-green-600"
//                                   />
//                                 </div>
//                                 <span className="font-semibold text-sm">{match.skill_match}%</span>
//                               </div>
//                             </td>
//                             <td className="py-3 px-4">
//                               <div className="flex flex-wrap gap-1">
//                                 {match.missing_skills && match.missing_skills.length > 0 ? (
//                                   match.missing_skills.slice(0, 2).map((skill: string, i: number) => (
//                                     <span
//                                       key={i}
//                                       className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded"
//                                     >
//                                       {skill}
//                                     </span>
//                                   ))
//                                 ) : (
//                                   <span className="text-green-600 text-xs">None</span>
//                                 )}
//                                 {match.missing_skills && match.missing_skills.length > 2 && (
//                                   <span className="text-xs text-muted-foreground">
//                                     +{match.missing_skills.length - 2}
//                                   </span>
//                                 )}
//                               </div>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </motion.div>
//               )}

//               {!data && !loading && !error && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center py-12 bg-card border border-border rounded-lg"
//                 >
//                   <Target className="mx-auto text-muted-foreground mb-4" size={48} />
//                   <p className="text-muted-foreground">Upload resumes and enter a job description to find matches</p>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import FileUploader from "@/components/FileUploader"
import { Target, AlertCircle } from "lucide-react"
import { matchResumes } from "@/services/jobMatcherService"

export default function JobMatcherPage() {
  const [files, setFiles] = useState<File[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => setFiles((prev) => [...prev, file])
  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index))

  const handleFindMatches = async () => {
    if (files.length === 0 || !jobDescription.trim()) {
      alert("Please upload at least one resume and enter a job description")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await matchResumes(jobDescription, files)
      setData(response)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Job Matcher</h1>
            <p className="text-muted-foreground">Match multiple resumes against a job description</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Upload Resumes</h2>
                <div className="space-y-4">
                  <FileUploader onFileSelect={handleFileSelect} label="Upload resumes" />

                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{file.name}</span>
                          <button onClick={() => removeFile(index)} className="text-destructive hover:bg-destructive/10 p-1 rounded transition">✕</button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Job Description</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste job description here…"
                      rows={6}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <button
                    onClick={handleFindMatches}
                    disabled={loading || files.length === 0 || !jobDescription.trim()}
                    className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Matching..." : "Find Matches"}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="lg:col-span-2">
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="inline-block">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Matching resumes...</p>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
                  <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-destructive">Error</h3>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </motion.div>
              )}

              {data && data.results && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Resume</th>
                          <th className="text-left py-3 px-4 font-semibold">Match Score</th>
                          <th className="text-left py-3 px-4 font-semibold">Snippet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.results.map((match: any, index: number) => (
                          <motion.tr key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-muted/50 transition">
                            <td className="py-3 px-4 font-medium">{match.resume_name}</td>
                            <td className="py-3 px-4 font-semibold text-blue-600">{match.similarity_score}%</td>
                            <td className="py-3 px-4 text-muted-foreground">{match.snippet}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {!data && !loading && !error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-card border border-border rounded-lg">
                  <Target className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">Upload resumes and enter a job description to find matches</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
