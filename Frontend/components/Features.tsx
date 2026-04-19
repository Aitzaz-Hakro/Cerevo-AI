// components/Features.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Zap, BookOpen, Briefcase, Target } from "lucide-react";

const features = [
  { href: "/ats-checker", icon: Zap, title: "ATS Checker", description: "Ensure your resume passes modern Applicant Tracking Systems with actionable fixes." },
  { href: "/job-matcher", icon: Target, title: "Job Matcher", description: "Compare your resume against a job description and get a clear match breakdown." },
  { href: "/portfolio-builder", icon: Briefcase, title: "Portfolio Builder", description: "Generate a polished portfolio website to showcase your skills and projects." },
  { href: "/resume-builder", icon: BookOpen, title: "Resume Builder", description: "Create recruiter-ready resumes in minutes with AI-assisted writing support." },
];

export default function Features() {
  return (
    <div id="features">
      <h2 className="text-3xl font-bold mb-8">Cerevo Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Link
              key={i}
              href={f.href}
              className="bg-card/40 border border-border/30 rounded-lg p-6 transition hover:shadow-lg hover:-translate-y-1 block text-left"
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-md bg-linear-to-br from-teal-400/20 to-blue-500/20">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
