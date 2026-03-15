// components/CTA.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <div className="bg-gradient-to-r from-teal-400/10 to-blue-500/10 rounded-2xl border border-border/30 p-12 text-center">
      <h3 className="text-3xl font-bold mb-4">Ready to accelerate your career?</h3>
      <p className="text-muted-foreground mb-6">Get personalized AI guidance and job matches — free forever. Start building your future today.</p>
      <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg font-semibold text-white shadow-lg shadow-primary/20">
        Get Started for Free <ArrowRight />
      </Link>
    </div>
  );
}
