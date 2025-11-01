"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import FileUploader from "@/components/FileUploader"
import ResultCard from "@/components/ResultCard"
import SkillList from "@/components/SkillList"
import { useApi } from "@/hooks/useApi"
import { FileText, AlertCircle, CheckCircle } from "lucide-react"
import { analyzeResume } from "@/services/resumeAnalyzer"; // this was addition for 422 error
export default function ResumeAnalyzerPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const { data, loading, error, request,setData } = useApi()

  // const handleFileSelect = async (selectedFile: File) => {
  //   setFile(selectedFile)
  //   const formData = new FormData()
  //   formData.append("file", selectedFile)

  //   try {
  //     // await request("post", "/resume/analyze", formData)
  //     // await request("post", "/v1/resume/analyze", formData)
  //   // await analyzeResume(selectedFile);// for error 422
  //    const response = await analyzeResume(selectedFile);
  //   console.log("Resume Analysis Result:", response);
  //    setData(response);
  //   } catch (err) {
  //     console.error("Error analyzing resume:", err)
  //   }
  // }
  const handleFileSelect = async (selectedFile: File) => {
  setFile(selectedFile);
  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await analyzeResume(selectedFile);
    console.log("Resume Analysis Result:", response);

    // ✅ Update the hook state manually
    setData(response.data); // <---- add this line
  } catch (err) {
    console.error("Error analyzing resume:", err);
  }
};


  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-muted-foreground">Upload your resume to get detailed analysis and recommendations</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            <div className="lg:col-span-2">
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="inline-block">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Analyzing your resume...</p>
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

              {/* {data && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <ResultCard title="Overall Score" icon={<CheckCircle size={24} />} delay={0}>
                    <div className="text-3xl font-bold text-primary mb-2">{data.score || 75}%</div>
                    <p className="text-sm">{data.summary || "Your resume looks great!"}</p>
                  </ResultCard>

                  {data.skills && (
                    <ResultCard title="Detected Skills" delay={0.1}>
                      <SkillList skills={data.skills} />
                    </ResultCard>
                  )}

                  {data.improvements && (
                    <ResultCard title="Recommendations" delay={0.2}>
                      <ul className="space-y-2">
                        {data.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}
                </motion.div>
              )}

              {!data && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-card border border-border rounded-lg"
                >
                  <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">Upload a resume to get started</p>
                </motion.div>
              )} */}
              {data && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

    {/* Basic Info Section */}
    <ResultCard title="Basic Information" delay={0}>
      <ul className="space-y-2">
        <li><strong>Name:</strong> {data.basic_info?.name || "Not found"}</li>
        <li><strong>Email:</strong> {data.basic_info?.email || "Not found"}</li>
        <li><strong>Phone:</strong> {data.basic_info?.phone || "Not found"}</li>
      </ul>
    </ResultCard>

    {/* Skills Section */}
    {data.sections?.skills?.length > 0 && (
      <ResultCard title="Detected Skills" delay={0.1}>
        <SkillList skills={data.sections.skills} />
      </ResultCard>
    )}

    {/* Education Section */}
    {data.sections?.education?.length > 0 && (
      <ResultCard title="Education" delay={0.15}>
        <ul className="space-y-1">
          {data.sections.education.map((edu: string, i: number) => (
            <li key={i}>• {edu}</li>
          ))}
        </ul>
      </ResultCard>
    )}

    {/* Experience Section */}
    {data.sections?.experience?.length > 0 && (
      <ResultCard title="Experience" delay={0.2}>
        <ul className="space-y-1">
          {data.sections.experience.map((exp: string, i: number) => (
            <li key={i}>• {exp}</li>
          ))}
        </ul>
      </ResultCard>
    )}

    {/* Projects Section */}
    {data.sections?.projects?.length > 0 && (
      <ResultCard title="Projects" delay={0.25}>
        <ul className="space-y-1">
          {data.sections.projects.map((proj: string, i: number) => (
            <li key={i}>• {proj}</li>
          ))}
        </ul>
      </ResultCard>
    )}

    {/* Achievements Section */}
    {data.sections?.achievements?.length > 0 && (
      <ResultCard title="Achievements" delay={0.3}>
        <ul className="space-y-1">
          {data.sections.achievements.map((ach: string, i: number) => (
            <li key={i}>• {ach}</li>
          ))}
        </ul>
      </ResultCard>
    )}
  </motion.div>
)}


              
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
