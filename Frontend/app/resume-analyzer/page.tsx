"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "@/components/FileUploader";
import { useApi } from "@/hooks/useApi";
import { analyzeResume } from "@/services/resumeAnalyzer";
import { 
  FileText, 
  Rocket, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Target,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

// Type for criteria items
interface CriteriaItem {
  score: number;
  feedback: string;
}

// Type for API response
interface AnalysisResult {
  overall_score: number;
  criteria: Record<string, CriteriaItem>;
  final_feedback: string;
}

// Helper to format criteria names
const formatCriteriaName = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get score color
const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};

// Get score background
const getScoreBg = (score: number): string => {
  if (score >= 80) return "bg-green-500/10 border-green-500/20";
  if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
  if (score >= 40) return "bg-orange-500/10 border-orange-500/20";
  return "bg-red-500/10 border-red-500/20";
};

// Get progress bar color
const getProgressColor = (score: number): string => {
  if (score >= 80) return "from-green-500 to-emerald-500";
  if (score >= 60) return "from-yellow-500 to-amber-500";
  if (score >= 40) return "from-orange-500 to-amber-500";
  return "from-red-500 to-rose-500";
};

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const { data, loading, error, setData, setError } = useApi<AnalysisResult>();

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setError(null);
      const response = await analyzeResume(file);
      setData(response); // API returns data directly, not wrapped
    } catch (err: unknown) {
      console.error("Error analyzing resume:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze resume");
    }
  };

  const handleReset = () => {
    setFile(null);
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Analyze Your Resume
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Get Detailed Scores
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get comprehensive AI-powered analysis with scores across 16 key criteria. 
              Understand how recruiters and ATS systems evaluate your resume.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Target, text: "16 Criteria Scoring" },
                { icon: TrendingUp, text: "ATS Optimization" },
                { icon: MessageSquare, text: "Detailed Feedback" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-full">
                  <feature.icon size={16} className="text-primary" />
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
              className="lg:col-span-4 xl:col-span-3"
            >
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20">
                    <FileText className="text-primary" size={22} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Upload Resume</h2>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX supported</p>
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
                    className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-5 space-y-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                    text-white font-semibold transition-all duration-300
                    ${file && !loading
                      ? "bg-gradient-to-r from-primary via-cyan-500 to-teal-500 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
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
                        <Rocket size={18} />
                        Analyze Resume
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

                {/* Tips */}
                {!data && !loading && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sparkles size={14} className="text-primary" />
                      Pro Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-primary mt-0.5 flex-shrink-0" />
                        Upload PDF for best results
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-primary mt-0.5 flex-shrink-0" />
                        Ensure text is selectable (not scanned)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-primary mt-0.5 flex-shrink-0" />
                        Keep file size under 5MB
                      </li>
                    </ul>
                  </div>
                )}

                {/* CTA for non-logged users */}
                {!data && !loading && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-xl border border-primary/20">
                    <p className="text-sm font-medium mb-2">Want more features?</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Sign up for job matching, skill gap analysis, and more.
                    </p>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
                      bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-medium
                      hover:shadow-lg transition-all"
                    >
                      Get Started Free
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Results Panel */}
            <div className="lg:col-span-8 xl:col-span-9">
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
                      <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={24} className="text-primary" />
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-medium">Analyzing your resume...</p>
                    <p className="text-sm text-muted-foreground mt-1">Scoring across 16 criteria</p>
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
                      <button
                        onClick={handleReset}
                        className="mt-3 text-sm text-destructive hover:underline"
                      >
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
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 mb-6">
                      <FileText size={48} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                    <p className="text-muted-foreground text-center max-w-sm px-4 mb-6">
                      Drop your resume file and click analyze to get detailed AI-powered scores and feedback.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['ATS Score', 'Grammar', 'Skills', 'Formatting'].map((item) => (
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
                    {/* Overall Score Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-card via-card to-card/80 border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-full blur-3xl" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative">
                        <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ${getScoreBg(data.overall_score)} border-2 flex flex-col items-center justify-center flex-shrink-0`}>
                          <span className={`text-4xl sm:text-5xl font-bold ${getScoreColor(data.overall_score)}`}>
                            {data.overall_score}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">out of 100</span>
                        </div>
                        
                        <div className="flex-1">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Overall Score</h2>
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {data.overall_score >= 80 
                              ? "Excellent! Your resume is well-optimized."
                              : data.overall_score >= 60 
                              ? "Good foundation, with room for improvement."
                              : data.overall_score >= 40
                              ? "Some areas need attention for better results."
                              : "Significant improvements needed."}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${data.overall_score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${getProgressColor(data.overall_score)} rounded-full`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Criteria Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Target className="text-primary" size={20} />
                        </div>
                        <h3 className="font-semibold text-lg">Detailed Criteria Scores</h3>
                        <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {Object.keys(data.criteria).length} criteria
                        </span>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Object.entries(data.criteria).map(([key, item], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.03 }}
                            className={`p-4 rounded-xl border ${getScoreBg(item.score)} hover:shadow-md transition-all`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{formatCriteriaName(key)}</h4>
                              <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                                {item.score}
                              </span>
                            </div>
                            
                            {/* Mini Progress Bar */}
                            <div className="h-1.5 bg-background/50 rounded-full overflow-hidden mb-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + index * 0.03 }}
                                className={`h-full bg-gradient-to-r ${getProgressColor(item.score)} rounded-full`}
                              />
                            </div>
                            
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                              {item.feedback}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Final Feedback */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-cyan-500/10">
                          <MessageSquare className="text-cyan-500" size={20} />
                        </div>
                        <h3 className="font-semibold text-lg">Summary & Recommendations</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.final_feedback}
                      </p>
                    </motion.div>

                    {/* CTA Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-teal-500/10 border border-primary/20 rounded-2xl p-6 sm:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold mb-2">
                            Want to improve your score?
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Get job recommendations, skill gap analysis, and AI-powered resume building.
                          </p>
                        </div>
                        <Link
                          href="/signup"
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                          bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold
                          hover:shadow-lg hover:shadow-primary/25 transition-all shrink-0"
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
