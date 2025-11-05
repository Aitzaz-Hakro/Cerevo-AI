// components/About.tsx
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="grid my-10 grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-3xl font-bold mb-4">Career-focused AI, built for impact</h3>
        <p className="text-muted-foreground mb-6">
          Cerevo is a career-focused AI platform that helps individuals discover better opportunities and close skill gaps faster.
          Our machine learning models are trained to understand resumes, job descriptions, and market signals — turning data into clear,
          actionable steps for career growth.
        </p>

        <ul className="grid gap-4">
          <li className="flex gap-3 items-start">
            <CheckCircle className="text-primary" />
            <div>
              <div className="font-semibold">AI-powered insights</div>
              <div className="text-sm text-muted-foreground">Actionable recommendations derived from ML models trained on hiring signals.</div>
            </div>
          </li>

          <li className="flex gap-3 items-start">
            <CheckCircle className="text-primary" />
            <div>
              <div className="font-semibold">All features in one place</div>
              <div className="text-sm text-muted-foreground">From building resumes to matching jobs and studying with MCQs.</div>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-card/30 border border-border/30 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-3">How it works</h4>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
          <li>Upload or create your resume with our AI Resume Builder.</li>
          <li>Run an ATS check and improve your score with suggestions.</li>
          <li>See job recommendations and match scores tailored to your profile.</li>
          <li>Identify skill gaps and take MCQs to prepare for interviews.</li>
        </ol>
      </div>
    </div>
  );
}
