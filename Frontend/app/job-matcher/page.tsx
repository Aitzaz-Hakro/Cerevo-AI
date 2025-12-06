"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "@/components/FileUploader";
import { matchResumes } from "@/services/jobMatcherService";
import {
  FileText,
  Target,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  Star
} from "lucide-react";
import Link from "next/link";

interface MatchResult {
  resume_name?: string;
  similarity_score?: number;
  snippet?: string;
}

export default function JobMatcherPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [data, setData] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    if (!file || !jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await matchResumes(jobDescription, [file]);
      // Handle response with results array
      const results = response?.results || (Array.isArray(response) ? response : [response]);
      setData(results);
    } catch (err: any) {
      setError(err?.message || err || "Failed to match resume with job");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setData(null);
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-blue-500 to-indigo-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Target size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Smart Matching</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Job
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Matcher
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              See how well your resume matches any job description. Get detailed skill alignment
              and personalized improvement suggestions.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Target, text: "Skill Matching" },
                { icon: TrendingUp, text: "Gap Analysis" },
                { icon: Star, text: "Smart Scoring" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-full">
                  <feature.icon size={16} className="text-blue-500" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Input Panel */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 space-y-6">
                {/* Resume Upload */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <FileText className="text-blue-500" size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Your Resume</h2>
                      <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                    </div>
                  </div>

                  <FileUploader
                    onFileSelect={(f) => setFile(f)}
                    accept=".pdf,.doc,.docx"
                    label="Drop your resume here"
                  />

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center gap-3"
                    >
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FileText size={16} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <Briefcase className="text-indigo-500" size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Job Description</h2>
                      <p className="text-xs text-muted-foreground">Paste the full JD</p>
                    </div>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-48 p-4 bg-muted/30 border border-border rounded-xl
                    text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30
                    placeholder:text-muted-foreground/50 transition-all"
                  />

                  {jobDescription && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {jobDescription.split(/\s+/).length} words
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleMatch}
                    disabled={!file || !jobDescription.trim() || loading}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                    text-white font-semibold transition-all duration-300
                    ${file && jobDescription.trim() && !loading
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Analyzing Match...
                      </>
                    ) : (
                      <>
                        <Target size={18} />
                        Match Resume
                      </>
                    )}
                  </button>

                  {data && (
                    <button
                      onClick={handleReset}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                      border border-border hover:bg-muted transition-all text-sm"
                    >
                      <RefreshCw size={16} />
                      Try Another Job
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {/* Loading */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24 bg-card border border-border rounded-2xl"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Target size={24} className="text-blue-500" />
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-medium">Analyzing job match...</p>
                    <p className="text-sm text-muted-foreground mt-1">Comparing skills and requirements</p>
                  </motion.div>
                )}

                {/* Error */}
                {error && !loading && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-start gap-4"
                  >
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <AlertCircle className="text-destructive" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-destructive">Match Failed</h4>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                      <button onClick={handleReset} className="mt-3 text-sm text-destructive hover:underline">
                        Try again
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Empty State */}
                {!data && !loading && !error && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 sm:py-28 bg-card border border-border rounded-2xl"
                  >
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 mb-6">
                      <Users size={48} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Match Your Resume</h3>
                    <p className="text-muted-foreground text-center max-w-sm px-4 mb-6">
                      Upload your resume and paste a job description to see how well they match.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['Skills', 'Experience', 'Keywords', 'Fit Score'].map((item) => (
                        <span key={item} className="px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Results */}
                {data && !loading && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {data.map((result, index) => {
                      const score = result.similarity_score || 0;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card border border-border rounded-2xl overflow-hidden p-5 sm:p-6"
                        >
                          <div className="flex items-center gap-4">
                            {/* Score Circle */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                              <svg className="w-full h-full -rotate-90">
                                <circle
                                  cx="50%"
                                  cy="50%"
                                  r="40%"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="6"
                                  className="text-muted/20"
                                />
                                <circle
                                  cx="50%"
                                  cy="50%"
                                  r="40%"
                                  fill="none"
                                  stroke="url(#matchGradient)"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  strokeDasharray={`${score * 2.51} 251`}
                                />
                                <defs>
                                  <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-xl sm:text-2xl font-bold ${getScoreColor(score)}`}>
                                  {score}%
                                </span>
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {result.resume_name || file?.name || "Your Resume"}
                              </h3>
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getScoreGradient(score)} text-white`}>
                                <TrendingUp size={12} />
                                {score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : score >= 40 ? "Fair Match" : "Low Match"}
                              </div>
                            </div>
                          </div>

                          {/* Snippet/Summary */}
                          {result.snippet && (
                            <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={16} className="text-blue-500" />
                                <span className="font-medium text-sm">Match Summary</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {result.snippet}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}

                    {/* CTA Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold mb-2">
                            Bridge your skill gaps
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Sign up to get personalized learning paths and job recommendations.
                          </p>
                        </div>
                        <Link
                          href="/signup"
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                          bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold
                          hover:shadow-lg hover:shadow-blue-500/25 transition-all shrink-0"
                        >
                          Get Started
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
