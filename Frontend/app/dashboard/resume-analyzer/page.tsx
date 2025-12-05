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
  Download,
  RefreshCw
} from "lucide-react";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const { data, loading, error, setData } = useApi();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    setActiveSection(null);
  };

  // Filter out noise from skills - only keep clean skill names
  const cleanSkills = (skills: string[] | undefined) => {
    if (!skills) return [];
    const techKeywords = ['javascript', 'typescript', 'react', 'next.js', 'nextjs', 'node', 'python', 'java', 'html', 'css', 'tailwind', 'bootstrap', 'git', 'sql', 'mysql', 'postgresql', 'mongodb', 'php', 'supabase', 'prisma', 'nextauth', 'shadcn', 'firebase', 'aws', 'docker', 'kubernetes', 'graphql', 'rest', 'api', 'figma', 'photoshop', 'illustrator'];
    const softKeywords = ['communication', 'problem solving', 'time management', 'leadership', 'teamwork', 'project management', 'public speaking', 'critical thinking'];
    
    return skills
      .map(s => s.replace(/\n/g, ' ').trim())
      .filter(s => {
        const lower = s.toLowerCase();
        // Keep if it's a known tech/soft skill or is short enough to be a skill name
        return (
          techKeywords.some(k => lower.includes(k)) ||
          softKeywords.some(k => lower.includes(k)) ||
          (s.length < 30 && !s.includes('•') && !s.includes(':'))
        );
      })
      .map(s => {
        // Extract just the skill name if it contains extra text
        for (const keyword of [...techKeywords, ...softKeywords]) {
          if (s.toLowerCase().includes(keyword)) {
            return keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }
        return s;
      })
      .filter((s, i, arr) => arr.indexOf(s) === i) // Remove duplicates
      .slice(0, 15); // Limit to 15 skills
  };

  // Clean experience/projects - filter meaningful entries
  const cleanEntries = (entries: string[] | undefined) => {
    if (!entries) return [];
    return entries
      .map(e => e.replace(/\n/g, ' ').trim())
      .filter(e => e.length > 20 && (e.includes('•') || e.startsWith('Developed') || e.startsWith('Built') || e.startsWith('Created') || e.startsWith('Led') || e.startsWith('Collaborated') || e.startsWith('Designed') || e.startsWith('Implemented')))
      .map(e => e.replace(/^•\s*/, ''))
      .slice(0, 5);
  };

  const sections = [
    { 
      id: 'skills', 
      title: 'Technical Skills', 
      icon: Code, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    { 
      id: 'experience', 
      title: 'Work Experience', 
      icon: Briefcase, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    { 
      id: 'projects', 
      title: 'Projects', 
      icon: FolderKanban, 
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    { 
      id: 'education', 
      title: 'Education', 
      icon: GraduationCap, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    { 
      id: 'certifications', 
      title: 'Certifications', 
      icon: Award, 
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30'
    },
    { 
      id: 'achievements', 
      title: 'Achievements', 
      icon: Trophy, 
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
            <Sparkles size={14} />
            AI-Powered Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Resume Analyzer
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            Upload your resume and get instant AI-powered insights, skill extraction, and detailed section analysis.
          </p>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT PANEL - Upload Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="text-primary" size={20} />
                </div>
                <h2 className="font-semibold text-lg">Upload Resume</h2>
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
                  className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-3"
                >
                  <FileText size={18} className="text-primary flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                </motion.div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-5 space-y-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  text-white font-medium transition-all duration-300
                  ${file && !loading
                    ? "bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
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

              {/* TIPS */}
              {!data && !loading && (
                <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                  <h4 className="text-sm font-medium mb-2">💡 Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Upload PDF or DOCX format</li>
                    <li>• Ensure text is selectable</li>
                    <li>• Keep file size under 5MB</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT PANEL – RESULTS */}
          <div className="lg:col-span-8 xl:col-span-9">

            {/* LOADING STATE */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                  </div>
                  <p className="mt-6 text-muted-foreground font-medium">Analyzing your resume...</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">This may take a few seconds</p>
                </motion.div>
              )}

              {/* ERROR STATE */}
              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-4"
                >
                  <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h4 className="font-medium text-destructive">Analysis Failed</h4>
                    <p className="text-sm text-destructive/80 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* EMPTY STATE */}
              {!data && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 sm:py-24 bg-card border border-border rounded-2xl"
                >
                  <div className="p-4 rounded-2xl bg-muted/50 mb-6">
                    <FileText size={48} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Resume Uploaded</h3>
                  <p className="text-muted-foreground text-center max-w-sm px-4">
                    Upload your resume on the left panel and click analyze to get detailed insights.
                  </p>
                </motion.div>
              )}

              {/* RESULTS */}
              {data && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* PROFILE CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Avatar */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                        <User size={32} className="text-white" />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold truncate">
                          {data.basic_info?.name || "Candidate"}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                          {data.basic_info?.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-primary" />
                              <span className="truncate">{data.basic_info.email}</span>
                            </div>
                          )}
                          {data.basic_info?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-primary" />
                              <span>{data.basic_info.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* SKILLS SECTION */}
                  {data.sections?.skills && cleanSkills(data.sections.skills).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Code className="text-blue-500" size={20} />
                        </div>
                        <h3 className="font-semibold text-lg">Technical Skills</h3>
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

                  {/* EXPERIENCE SECTION */}
                  {data.sections?.experience && cleanEntries(data.sections.experience).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
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

                  {/* PROJECTS SECTION */}
                  {data.sections?.projects && cleanEntries(data.sections.projects).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/10">
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

                  {/* EDUCATION SECTION */}
                  {data.sections?.education && data.sections.education.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <GraduationCap className="text-green-500" size={20} />
                        </div>
                        <h3 className="font-semibold text-lg">Education</h3>
                      </div>
                      <div className="space-y-3">
                        {data.sections.education
                          .filter((edu: string) => edu.length > 3 && !edu.toUpperCase().includes('EDUCATION'))
                          .slice(0, 3)
                          .map((edu: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <p className="text-sm text-muted-foreground">{edu}</p>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* CERTIFICATIONS & ACHIEVEMENTS */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Certifications */}
                    {data.sections?.certifications && data.sections.certifications.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-teal-500/10">
                            <Award className="text-teal-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Certifications</h3>
                        </div>
                        <div className="space-y-2">
                          {data.sections.certifications.slice(0, 5).map((cert: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                              {cert}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Achievements */}
                    {data.sections?.achievements && data.sections.achievements.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-card border border-border rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-amber-500/10">
                            <Trophy className="text-amber-500" size={20} />
                          </div>
                          <h3 className="font-semibold text-lg">Achievements</h3>
                        </div>
                        <div className="space-y-2">
                          {data.sections.achievements.slice(0, 5).map((achievement: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}