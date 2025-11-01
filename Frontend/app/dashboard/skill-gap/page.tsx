
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import FileUploader from "@/components/FileUploader";
import ResultCard from "@/components/ResultCard";
import { BarChart3, AlertCircle } from "lucide-react";
import { analyzeSkillGap } from "@/services/skillGapService";

// Define the shape of API response
interface SkillGapResponse {
  status: string;
  requiredSkills: string[];
  presentSkills: string[];
  missingSkills: string[];
  matchedSkills: string[];
  skillMatchPercentage: number;
}

export default function SkillGapPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [data, setData] = useState<SkillGapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Please upload a resume and enter a job description");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res: SkillGapResponse = await analyzeSkillGap(jobDescription, file);
      console.log("Skill gap analysis result:", res);
      setData(res);
    } catch (err: any) {
      console.error("Error analyzing skill gap:", err);
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to analyze skill gap"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
            <p className="text-muted-foreground">
              Identify skills you need to develop for your target role
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
                <h2 className="font-semibold mb-4">Analyze Gap</h2>
                <div className="space-y-4">
                  <FileUploader
                    onFileSelect={handleFileSelect}
                    label="Upload your resume"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here…"
                      rows={6}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !file || !jobDescription.trim()}
                    className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Analyze Gap"}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-block">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Analyzing skill gap...
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3"
                >
                  <AlertCircle
                    className="text-destructive flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h3 className="font-semibold text-destructive">Error</h3>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </motion.div>
              )}

              {data && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Overall Skill Match */}
                  {data.skillMatchPercentage !== undefined && (
                    <ResultCard title="Overall Skill Match" delay={0}>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-4">
                          {data.skillMatchPercentage}%
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${data.skillMatchPercentage}%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-teal-400 to-blue-500"
                          />
                        </div>
                      </div>
                    </ResultCard>
                  )}

                  {/* Required Skills */}
                  {data.requiredSkills && (
                    <ResultCard title="Required Skills" delay={0.1}>
                      <div className="flex flex-wrap gap-2">
                        {data.requiredSkills.map((skill: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="px-3 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </ResultCard>
                  )}

                  {/* Present Skills */}
                  {data.presentSkills && (
                    <ResultCard title="Your Present Skills" delay={0.2}>
                      <div className="flex flex-wrap gap-2">
                        {data.presentSkills.map((skill: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </ResultCard>
                  )}

                  {/* Missing Skills */}
                  {data.missingSkills && (
                    <ResultCard title="Missing Skills" delay={0.3}>
                      <div className="flex flex-wrap gap-2">
                        {data.missingSkills.map((skill: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="px-3 py-1 bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
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
                  <BarChart3
                    className="mx-auto text-muted-foreground mb-4"
                    size={48}
                  />
                  <p className="text-muted-foreground">
                    Upload your resume and enter a job description to analyze
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
