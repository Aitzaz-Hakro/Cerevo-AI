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
  User, 
  Mail, 
  Phone, 
  Code, 
  GraduationCap, 
  Briefcase, 
  FolderKanban,
  Trophy,
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const { data, loading, error, setData } = useApi();

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      const response = await analyzeResume(file);
      setData(response.data);
    } catch (err) {
      console.error("Error analyzing resume:", err);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData(null);
  };

  // Filter out noise from skills
  const cleanSkills = (skills: string[] | undefined) => {
    if (!skills) return [];
    const techKeywords = ['javascript', 'typescript', 'react', 'next.js', 'nextjs', 'node', 'python', 'java', 'html', 'css', 'tailwind', 'bootstrap', 'git', 'sql', 'mysql', 'postgresql', 'mongodb', 'php', 'supabase', 'prisma', 'nextauth', 'shadcn', 'firebase', 'aws', 'docker', 'kubernetes', 'graphql', 'rest', 'api', 'figma', 'photoshop', 'illustrator'];
    const softKeywords = ['communication', 'problem solving', 'time management', 'leadership', 'teamwork', 'project management', 'public speaking', 'critical thinking'];
    
    return skills
      .map(s => s.replace(/\n/g, ' ').trim())
      .filter(s => {
        const lower = s.toLowerCase();
        return (
          techKeywords.some(k => lower.includes(k)) ||
          softKeywords.some(k => lower.includes(k)) ||
          (s.length < 30 && !s.includes('•') && !s.includes(':'))
        );
      })
      .map(s => {
        for (const keyword of [...techKeywords, ...softKeywords]) {
          if (s.toLowerCase().includes(keyword)) {
            return keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }
        return s;
      })
      .filter((s, i, arr) => arr.indexOf(s) === i)
      .slice(0, 15);
  };

  const cleanEntries = (entries: string[] | undefined) => {
    if (!entries) return [];
    return entries
      .map(e => e.replace(/\n/g, ' ').trim())
      .filter(e => e.length > 20 && (e.includes('•') || e.startsWith('Developed') || e.startsWith('Built') || e.startsWith('Created') || e.startsWith('Led') || e.startsWith('Collaborated') || e.startsWith('Designed') || e.startsWith('Implemented')))
      .map(e => e.replace(/^•\s*/, ''))
      .slice(0, 5);
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
              <span className="text-sm font-medium text-primary">Free AI-Powered Analysis</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Analyze Your Resume
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get instant AI-powered insights on your resume. Discover your strengths, 
              extract skills, and understand how recruiters see your profile.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: CheckCircle, text: "Instant Analysis" },
                { icon: Code, text: "Skill Extraction" },
                { icon: FileText, text: "Section Detection" },
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
                      Sign up for ATS checking, job matching, and skill gap analysis.
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
                    <p className="text-sm text-muted-foreground mt-1">Extracting skills and information</p>
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
                      Drop your resume file and click analyze to get instant AI-powered insights.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['Skills', 'Experience', 'Education', 'Projects'].map((item) => (
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
                    {/* Profile Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-card via-card to-card/80 border border-border rounded-2xl p-5 sm:p-6 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-full blur-3xl" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                          <User size={32} className="text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold truncate">
                            {data.basic_info?.name || "Candidate"}
                          </h2>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                            {data.basic_info?.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail size={14} className="text-primary" />
                                <span className="truncate">{data.basic_info.email}</span>
                              </div>
                            )}
                            {data.basic_info?.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone size={14} className="text-primary" />
                                <span>{data.basic_info.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Skills */}
                    {data.sections?.skills && cleanSkills(data.sections.skills).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-blue-500/10">
                            <Code className="text-blue-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Technical Skills</h3>
                          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {cleanSkills(data.sections.skills).length} detected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cleanSkills(data.sections.skills).map((skill: string, index: number) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 
                              text-sm rounded-lg border border-blue-500/20 hover:border-blue-500/40 
                              hover:bg-blue-500/20 transition-all cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Experience */}
                    {data.sections?.experience && cleanEntries(data.sections.experience).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-purple-500/10">
                            <Briefcase className="text-purple-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Work Experience</h3>
                        </div>
                        <div className="space-y-3">
                          {cleanEntries(data.sections.experience).map((exp: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + index * 0.05 }}
                              className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <ChevronRight size={18} className="text-purple-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground leading-relaxed">{exp}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Projects */}
                    {data.sections?.projects && cleanEntries(data.sections.projects).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-orange-500/10">
                            <FolderKanban className="text-orange-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Projects</h3>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {cleanEntries(data.sections.projects).map((project: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                              className="p-4 rounded-xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 
                              border border-orange-500/10 hover:border-orange-500/30 transition-all"
                            >
                              <p className="text-sm text-muted-foreground leading-relaxed">{project}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

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
                            Want to improve your resume?
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Get ATS scores, job recommendations, and personalized improvement tips.
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
