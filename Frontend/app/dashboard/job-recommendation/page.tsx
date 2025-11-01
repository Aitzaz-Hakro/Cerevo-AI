"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import FileUploader from "@/components/FileUploader"
import { Briefcase, AlertCircle } from "lucide-react"
import { getJobRecommendation } from "@/services/jobService"

interface RecommendationResponse {
  status: string
  recommended_job: string
  message: string
}

export default function JobRecommendationPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)

  const handleFileSelect = (selectedFile: File | null): void => {
    setFile(selectedFile)
  }

  const handleGetRecommendations = async (): Promise<void> => {
    if (!file) {
      alert("Please upload a resume file first!")
      return
    }

    setLoading(true)
    setError("")
    setRecommendation(null)

    try {
      const result: RecommendationResponse = await getJobRecommendation(file, jobTitleFilter)
      setRecommendation(result)
    } catch (err: any) {
      console.error("Error:", err)
      setError(String(err))
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
            <h1 className="text-3xl font-bold mb-2">Job Recommendations</h1>
            <p className="text-muted-foreground">
              Get personalized job recommendations based on your resume
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6 sticky top-24"
              >
                <h2 className="font-semibold mb-4">Upload Resume</h2>
                <div className="space-y-4">
                  <FileUploader onFileSelect={handleFileSelect} label="Upload your resume" />
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title Filter (Optional)</label>
                    <input
                      type="text"
                      value={jobTitleFilter}
                      onChange={(e) => setJobTitleFilter(e.target.value)}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleGetRecommendations}
                    disabled={loading || !file}
                    className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Get Recommendations"}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Main Result Section */}
            <div className="lg:col-span-2">
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="inline-block">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Finding job recommendations...</p>
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

              {recommendation && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">Recommended Job Role</h3>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {recommendation.recommended_job}
                    </p>
                    <p className="text-muted-foreground">{recommendation.message}</p>
                  </div>
                </motion.div>
              )}

              {!recommendation && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-card border border-border rounded-lg"
                >
                  <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">
                    Upload your resume to get personalized job recommendations
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
