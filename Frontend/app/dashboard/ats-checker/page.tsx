// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import DashboardNav from "@/components/DashboardNav"
// import FileUploader from "@/components/FileUploader"
// import ResultCard from "@/components/ResultCard"
// import { useApi } from "@/hooks/useApi"
// import { Zap, AlertCircle } from "lucide-react"

// export default function ATSCheckerPage() {
//   const [file, setFile] = useState<File | null>(null)
//   const { data, loading, error, request } = useApi()

//   const handleFileSelect = async (selectedFile: File) => {
//     setFile(selectedFile)
//     const formData = new FormData()
//     formData.append("file", selectedFile)

//     try {
//       await request("post", "/resume/ats-check", formData)
//     } catch (err) {
//       console.error("Error checking ATS:", err)
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardNav />
//       <main className="flex-1">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
//             <h1 className="text-3xl font-bold mb-2">ATS Checker</h1>
//             <p className="text-muted-foreground">Optimize your resume for Applicant Tracking Systems</p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-1">
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="bg-card border border-border rounded-lg p-6 sticky top-24"
//               >
//                 <h2 className="font-semibold mb-4">Upload Resume</h2>
//                 <FileUploader onFileSelect={handleFileSelect} accept=".pdf,.doc,.docx" label="Upload Resume" />
//               </motion.div>
//             </div>

//             <div className="lg:col-span-2">
//               {loading && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
//                   <div className="inline-block">
//                     <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
//                   </div>
//                   <p className="mt-4 text-muted-foreground">Checking ATS compatibility...</p>
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
//                   <ResultCard title="ATS Score" icon={<Zap size={24} />} delay={0}>
//                     <div className="text-3xl font-bold text-primary mb-2">{data.ats_score || 82}%</div>
//                     <p className="text-sm">{data.ats_summary || "Good ATS compatibility"}</p>
//                   </ResultCard>

//                   {data.issues && (
//                     <ResultCard title="Issues Found" delay={0.1}>
//                       <ul className="space-y-2">
//                         {data.issues.map((issue: string, index: number) => (
//                           <li key={index} className="flex gap-2 text-destructive">
//                             <span>⚠</span>
//                             <span>{issue}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </ResultCard>
//                   )}

//                   {data.suggestions && (
//                     <ResultCard title="Suggestions" delay={0.2}>
//                       <ul className="space-y-2">
//                         {data.suggestions.map((suggestion: string, index: number) => (
//                           <li key={index} className="flex gap-2">
//                             <span className="text-primary">✓</span>
//                             <span>{suggestion}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </ResultCard>
//                   )}
//                 </motion.div>
//               )}

//               {!data && !loading && !error && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center py-12 bg-card border border-border rounded-lg"
//                 >
//                   <Zap className="mx-auto text-muted-foreground mb-4" size={48} />
//                   <p className="text-muted-foreground">Upload a resume to check ATS compatibility</p>
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
import ResultCard from "@/components/ResultCard"
import { Zap, AlertCircle } from "lucide-react"
import { checkATSCompatibility } from "@/services/atsCheckerService"

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await checkATSCompatibility(selectedFile)
      if (result.status === "success") {
        setData(result.ats_report)
      } else {
        setError("Failed to process resume.")
      }
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
            <h1 className="text-3xl font-bold mb-2">ATS Checker</h1>
            <p className="text-muted-foreground">Optimize your resume for Applicant Tracking Systems</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Upload Section --- */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6 sticky top-24"
              >
                <h2 className="font-semibold mb-4">Upload Resume</h2>
                <FileUploader onFileSelect={handleFileSelect} accept=".pdf,.doc,.docx" label="Upload Resume" />
              </motion.div>
            </div>

            {/* --- Result Section --- */}
            <div className="lg:col-span-2">
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="inline-block">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Checking ATS compatibility...</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3"
                >
                  <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-destructive">Error</h3>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </motion.div>
              )}

              {data && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <ResultCard title="ATS Score" icon={<Zap size={24} />} delay={0}>
                    <div className="text-3xl font-bold text-primary mb-2">{data.overall_score}%</div>
                    <p className="text-sm">Resume: {data.resume_name}</p>
                    <p className="text-sm text-muted-foreground">Readability: {data.readability_score}</p>
                  </ResultCard>

                  <ResultCard title="Strengths" delay={0.1}>
                    <ul className="list-disc ml-5 space-y-1">
                      {data.strengths.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </ResultCard>

                  <ResultCard title="Weaknesses" delay={0.2}>
                    <ul className="list-disc ml-5 space-y-1 text-destructive">
                      {data.weaknesses.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </ResultCard>

                  <ResultCard title="Suggestions" delay={0.3}>
                    <ul className="list-disc ml-5 space-y-1 text-primary">
                      {data.suggestions.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </ResultCard>
                </motion.div>
              )}

              {!data && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-card border border-border rounded-lg"
                >
                  <Zap className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">Upload a resume to check ATS compatibility</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
