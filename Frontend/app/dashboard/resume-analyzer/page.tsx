"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FileUploader from "@/components/FileUploader";
import ResultCard from "@/components/ResultCard";
import SkillList from "@/components/SkillList";
import { useApi } from "@/hooks/useApi";
import { analyzeResume } from "@/services/resumeAnalyzer";
import { FileText, Rocket, AlertCircle, CheckCircle } from "lucide-react";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const { data, loading, error, request, setData } = useApi();

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      const response = await analyzeResume(file);
      setData(response.data);
    } catch (err) {
      console.error("Error analyzing resume:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-muted-foreground text-lg">
              Upload your resume and get detailed insights, improvements, and skill extraction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT PANEL */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-1 bg-card border border-border rounded-xl p-6 sticky top-24"
            >
              <h2 className="font-semibold mb-4 text-lg">Upload Resume</h2>

              <FileUploader
                onFileSelect={(f) => setFile(f)}
                accept=".pdf,.doc,.docx"
                label="Upload your resume"
              />

              {/* ANALYZE BUTTON */}
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className={`w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-lg
                text-white font-medium transition-all
                ${
                  file
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Rocket size={18} />
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </motion.div>

            {/* RIGHT PANEL – RESULTS */}
            <div className="lg:col-span-2">

              {/* SHOW LOADING */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-12 h-12 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="mt-4 text-muted-foreground">Analyzing your resume...</p>
                </motion.div>
              )}

              {/* SHOW ERROR */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex gap-3"
                >
                  <AlertCircle size={22} />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* NO FILE → SHOW CTA CARD */}
              {!data && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-card border border-border rounded-xl"
                >
                  <FileText size={50} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload a resume to begin</h3>
                  <p className="text-muted-foreground">
                    Once uploaded, click Analyze to get insights.
                  </p>
                </motion.div>
              )}

              {/* SHOW RESULTS */}
              {data && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                  {/* SCORE CARD */}
                  <ResultCard title="Overall Score" icon={<CheckCircle />} delay={0}>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {data.score || 75}%
                    </div>
                    <p className="text-sm">{data.summary || "Your resume looks good!"}</p>
                  </ResultCard>

                  {/* BASIC INFO */}
                  <ResultCard title="Basic Information" delay={0.05}>
                    <ul className="space-y-2">
                      <li><strong>Name:</strong> {data.basic_info?.name || "Not found"}</li>
                      <li><strong>Email:</strong> {data.basic_info?.email || "Not found"}</li>
                      <li><strong>Phone:</strong> {data.basic_info?.phone || "Not found"}</li>
                    </ul>
                  </ResultCard>

                  {/* SKILLS */}
                  {data.sections?.skills?.length > 0 && (
                    <ResultCard title="Skills Detected" delay={0.1}>
                      <SkillList skills={data.sections.skills} />
                    </ResultCard>
                  )}

                  {/* EDUCATION */}
                  {data.sections?.education?.length > 0 && (
                    <ResultCard title="Education" delay={0.15}>
                      <ul className="space-y-1">
                        {data.sections.education.map((edu: string, i: number) => (
                          <li key={i}>• {edu}</li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}

                  {/* EXPERIENCE */}
                  {data.sections?.experience?.length > 0 && (
                    <ResultCard title="Experience" delay={0.2}>
                      <ul className="space-y-1">
                        {data.sections.experience.map((exp: string, i: number) => (
                          <li key={i}>• {exp}</li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}

                  {/* PROJECTS */}
                  {data.sections?.projects?.length > 0 && (
                    <ResultCard title="Projects" delay={0.25}>
                      <ul className="space-y-1">
                        {data.sections.projects.map((p: string, i: number) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}

                  {/* ACHIEVEMENTS */}
                  {data.sections?.achievements?.length > 0 && (
                    <ResultCard title="Achievements" delay={0.3}>
                      <ul className="space-y-1">
                        {data.sections.achievements.map((a: string, i: number) => (
                          <li key={i}>• {a}</li>
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
  );
}