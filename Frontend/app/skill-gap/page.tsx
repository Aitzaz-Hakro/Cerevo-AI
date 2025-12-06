"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "@/components/FileUploader";
import { analyzeSkillGap } from "@/services/skillGapService";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  Zap,
  XCircle,
  Star,
  GraduationCap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface SkillGapResult {
  status?: string;
  requiredSkills?: string[];
  presentSkills?: string[];
  missingSkills?: string[];
  matchedSkills?: string[];
  skillMatchPercentage?: number;
}

export default function SkillGapPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [data, setData] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await analyzeSkillGap(file, jobDescription);
      setData(response);
    } catch (err: any) {
      setError(err?.message || err || "Failed to analyze skill gap");
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

  const cleanSkills = (skills: string[]): string[] => {
    if (!skills || !Array.isArray(skills)) return [];
    return skills.filter(skill => {
      if (!skill || typeof skill !== 'string') return false;
      const lower = skill.toLowerCase();
      if (lower.includes('not found') || lower.includes('none') || lower.includes('n/a')) return false;
      if (lower.length < 2 || lower.length > 50) return false;
      return true;
    });
  };

  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number | undefined) => {
    if (score === undefined) return "from-gray-500 to-gray-400";
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <TrendingUp size={16} className="text-cyan-500" />
              <span className="text-sm font-medium text-cyan-500">Career Growth</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Skill Gap
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Analyzer
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Identify the skills you need to land your dream job. Get personalized 
              learning recommendations to bridge the gap.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Target, text: "Gap Analysis" },
                { icon: BookOpen, text: "Learning Paths" },
                { icon: GraduationCap, text: "Career Roadmap" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-full">
                  <feature.icon size={16} className="text-cyan-500" />
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
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
                      <FileText className="text-cyan-500" size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Your Resume</h2>
                      <p className="text-xs text-muted-foreground">Current skills snapshot</p>
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
                      className="mt-3 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center gap-3"
                    >
                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <FileText size={16} className="text-cyan-500" />
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
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20">
                      <Briefcase className="text-teal-500" size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Target Role</h2>
                      <p className="text-xs text-muted-foreground">Paste job description</p>
                    </div>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description of your dream role..."
                    className="w-full h-40 p-4 bg-muted/30 border border-border rounded-xl
                    text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30
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
                    onClick={handleAnalyze}
                    disabled={!file || !jobDescription.trim() || loading}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                    text-white font-semibold transition-all duration-300
                    ${file && jobDescription.trim() && !loading
                      ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp size={18} />
                        Analyze Gap
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
                      Analyze Another
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
                      <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp size={24} className="text-cyan-500" />
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-medium">Analyzing skill gaps...</p>
                    <p className="text-sm text-muted-foreground mt-1">Comparing your skills with requirements</p>
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
                      <h4 className="font-semibold text-destructive">Analysis Failed</h4>
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
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 mb-6">
                      <Target size={48} className="text-cyan-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Identify Your Skill Gaps</h3>
                    <p className="text-muted-foreground text-center max-w-sm px-4 mb-6">
                      Upload your resume and target job to discover what skills you need to develop.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['Current Skills', 'Required Skills', 'Gap Analysis', 'Learning Path'].map((item) => (
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
                    {data.skillMatchPercentage !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                      >
                        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${getScoreGradient(data.skillMatchPercentage)} rounded-full blur-3xl opacity-20`} />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative">
                          {/* Score Circle */}
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto sm:mx-0">
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
                                stroke="url(#gapGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${data.skillMatchPercentage * 2.83} 283`}
                              />
                              <defs>
                                <linearGradient id="gapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#06b6d4" />
                                  <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-3xl sm:text-4xl font-bold ${getScoreColor(data.skillMatchPercentage)}`}>
                                {data.skillMatchPercentage}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Skill Match Score</h2>
                            <p className="text-muted-foreground">
                              You have {data.skillMatchPercentage}% of the required skills for this role.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Skills Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Present Skills */}
                      {data.presentSkills && cleanSkills(data.presentSkills).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-card border border-border rounded-2xl p-5"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle size={18} className="text-emerald-500" />
                            <h3 className="font-semibold">Your Skills</h3>
                            <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                              {cleanSkills(data.presentSkills).length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cleanSkills(data.presentSkills).map((skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Missing Skills */}
                      {data.missingSkills && cleanSkills(data.missingSkills).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="bg-card border border-border rounded-2xl p-5"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <XCircle size={18} className="text-red-500" />
                            <h3 className="font-semibold">Skills to Learn</h3>
                            <span className="ml-auto text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                              {cleanSkills(data.missingSkills).length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cleanSkills(data.missingSkills).map((skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Required Skills */}
                    {data.requiredSkills && cleanSkills(data.requiredSkills).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Target size={18} className="text-blue-500" />
                          <h3 className="font-semibold">Required Skills for This Role</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cleanSkills(data.requiredSkills).map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Matched Skills */}
                    {data.matchedSkills && cleanSkills(data.matchedSkills).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Star size={18} className="text-amber-500" />
                          <h3 className="font-semibold">Skills You Already Have</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cleanSkills(data.matchedSkills).map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* CTA Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-emerald-500/10 border border-cyan-500/20 rounded-2xl p-6 sm:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold mb-2">
                            Track your skill development
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Sign up to save your progress and get personalized learning recommendations.
                          </p>
                        </div>
                        <Link
                          href="/signup"
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                          bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold
                          hover:shadow-lg hover:shadow-cyan-500/25 transition-all shrink-0"
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
