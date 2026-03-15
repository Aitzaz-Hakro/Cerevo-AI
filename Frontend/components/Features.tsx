// components/Features.tsx
"use client";

import React from "react";
import { FileText, Zap, BookOpen, Briefcase, Target, BarChart3 } from "lucide-react";

const features = [
  { icon: FileText, title: "Resume Analyzer", description: "Upload your resume and let AI uncover strengths, weaknesses, and actionable improvements." },
  { icon: Zap, title: "ATS Checker", description: "Ensure your resume passes Applicant Tracking Systems used by top employers." },
  { icon: BookOpen, title: "AI Resume Builder", description: "Create professional, recruiter-ready resumes instantly." },
  { icon: Briefcase, title: "Job Recommendations", description: "Get AI-powered job matches aligned with your experience." },
  { icon: Target, title: "Job Matcher", description: "Compare your resume with job descriptions using ML-powered matching." },
  { icon: BarChart3, title: "Skill Gap Analysis", description: "Discover which skills to improve and how to grow faster in your career path." },
  { icon: BarChart3, title: "Job Market Insights", description: "Explore live job market trends, salary benchmarks, and growth analytics." },
  { icon: BookOpen, title: "MCQ Generator", description: "Practice AI-generated interview questions tailored to your target role." },
];

export default function Features() {
  return (
    <div id="features">
      <h2 className="text-3xl font-bold mb-8">All-in-one AI career tools</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-card/40 border border-border/30 rounded-lg p-6 transition hover:shadow-lg">
              <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-md bg-gradient-to-br from-teal-400/20 to-blue-500/20">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
