"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "@/components/FileUploader";
import { checkATSCompatibility } from "@/services/atsCheckerService";
import { 
  FileText, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Shield,
  Target,
  Award
} from "lucide-react";
import Link from "next/link";

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await checkATSCompatibility(file);
      if (response.status === "success" && response.ats_report) {
        setData(response.ats_report);
      } else {
        setError("Failed to process resume.");
      }
    } catch (err: any) {
      setError(err?.message || err || "Failed to check ATS compatibility");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData(null);
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Shield size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Beat the Bots</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                ATS Resume
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Checker
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              75% of resumes are rejected by ATS before a human sees them. 
              Check your resume's compatibility and get actionable improvements.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Zap, text: "Instant Score" },
                { icon: Target, text: "Keyword Analysis" },
                { icon: Award, text: "Format Check" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-full">
                  <feature.icon size={16} className="text-amber-500" />
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

            {/* Upload Panel */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4"
            >
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    <FileText className="text-amber-500" size={22} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Upload Resume</h2>
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
                    className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-3"
                  >
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <FileText size={16} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-5 space-y-3">
                  <button
                    onClick={handleCheck}
                    disabled={!file || loading}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                    text-white font-semibold transition-all duration-300
                    ${file && !loading
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Check ATS Score
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
                      Check Another
                    </button>
                  )}
                </div>

                {/* Info Box */}
                {!data && !loading && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" />
                      What We Check
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        Keyword optimization
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        Format compatibility
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        Section structure
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        Readability score
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results Panel */}
            <div className="lg:col-span-8">
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
                      <div className="w-20 h-20 border-4 border-amber-500/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={24} className="text-amber-500" />
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-medium">Analyzing ATS compatibility...</p>
                    <p className="text-sm text-muted-foreground mt-1">Checking keywords, format & structure</p>
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
                      <h4 className="font-semibold text-destructive">Check Failed</h4>
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
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 mb-6">
                      <Shield size={48} className="text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Check Your ATS Score</h3>
                    <p className="text-muted-foreground text-center max-w-sm px-4 mb-6">
                      Upload your resume to see how it performs with Applicant Tracking Systems.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['Keywords', 'Format', 'Structure', 'Score'].map((item) => (
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
                    {/* Score Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${getScoreGradient(data.overall_score || 0)} rounded-full blur-3xl opacity-20`} />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative">
                        {/* Score Circle */}
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto sm:mx-0">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="50%"
                              cy="50%"
                              r="45%"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-muted/20"
                            />
                            <circle
                              cx="50%"
                              cy="50%"
                              r="45%"
                              fill="none"
                              stroke="url(#scoreGradient)"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${(data.overall_score || 75) * 2.83} 283`}
                            />
                            <defs>
                              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ef4444" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl sm:text-5xl font-bold ${getScoreColor(data.overall_score)}`}>
                              {data.overall_score}
                            </span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 bg-gradient-to-r ${getScoreGradient(data.overall_score || 0)} text-white`}>
                            <TrendingUp size={14} />
                            {getScoreLabel(data.overall_score || 0)}
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold mb-2">ATS Compatibility Score</h2>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Resume:</span> {data.resume_name || "Your Resume"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Readability:</span> {data.readability_score || "N/A"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Strengths */}
                    {data.strengths && data.strengths.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-emerald-500/10">
                            <CheckCircle className="text-emerald-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Strengths</h3>
                          <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">
                            {data.strengths.length} found
                          </span>
                        </div>
                        <div className="space-y-3">
                          {data.strengths.map((strength: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                              className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
                            >
                              <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground">{strength}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Weaknesses */}
                    {data.weaknesses && data.weaknesses.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-red-500/10">
                            <XCircle className="text-red-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Weaknesses</h3>
                          <span className="ml-auto text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full">
                            {data.weaknesses.length} found
                          </span>
                        </div>
                        <div className="space-y-3">
                          {data.weaknesses.map((weakness: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + index * 0.05 }}
                              className="flex gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                            >
                              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground">{weakness}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Suggestions */}
                    {data.suggestions && data.suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-amber-500/10">
                            <Sparkles className="text-amber-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Suggestions</h3>
                        </div>
                        <div className="space-y-3">
                          {data.suggestions.map((suggestion: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                              className="flex gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                            >
                              <Sparkles size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground">{suggestion}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* CTA Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold mb-2">
                            Want to improve your score?
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Get personalized recommendations and AI-powered resume optimization.
                          </p>
                        </div>
                        <Link
                          href="/signup"
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                          bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold
                          hover:shadow-lg hover:shadow-amber-500/25 transition-all shrink-0"
                        >
                          Sign Up Free
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
