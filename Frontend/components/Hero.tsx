// components/Hero.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import StarBorder from "./StarBorder";
import RotatingText from "./RotatingText";
import LightRays from "./LightRaysBg"; // keep your existing file here
import LogoLoop from "./LogoLoop";

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* Background WebGL */}
      <div className="absolute inset-0 -z-10">
        <LightRays
          raysOrigin="top-right"
          raysColor="#7dd3fc"
          raysSpeed={1}
          lightSpread={1.4}
          rayLength={1.6}
          pulsating={true}
          followMouse={true}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071133]/40 via-transparent to-[#020617]/60 -z-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:py-15 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 sm:mt-4">
            {/* <Image src="/logo.png" alt="Cerevo" width={160} height={48} /> */}
            <h1 className="text-4xl sm:mt-5 md:mt-3 md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="block">Evolve Your Career with</span>
              <span className="block gradient-primary-text">Cerevo Ai</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Turn your resume into opportunities with AI that understands your career.
              Transform job searches and unlock high-impact decisions with our suite of{" "}
              <strong>AI career tools</strong>.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <StarBorder className="inline-block" color="#7dd3fc">
                <Link href="/signup" className="inline-flex items-center gap-2">
                  <span>Get Started for Free</span>
                  <ArrowRight size={16} />
                </Link>
              </StarBorder>

              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border/30 rounded-lg text-sm hover:bg-muted transition"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-6 flex  items-center  gap-3 text-sm text-muted-foreground">
              <span className="hidden sm:inline  bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Trusted by</span>
              <div   style={{
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.57), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.57))'
  }} className="w-44 sm:w-100 md:w-full lg:w-80 overflow-hidden rounded-lg  h-12 flex items-center">   
                <LogoLoop />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-card/30 border border-border/30 rounded-2xl p-8 backdrop-blur-md">
              <h4 className="text-sm font-medium text-muted-foreground">AI Tools</h4>
              <div className="mt-3 text-2xl font-bold">
                <span className="mr-2">Analyze • Build •</span>
                <RotatingText texts={["Match", "Grow", "Apply", "Level Up"]} interval={1800} className="gradient-primary-text" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {/* Top 4 features quick cards */}
                <div className="p-3 bg-card/40 border border-border/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Resume Analyzer</div>
                      <div className="text-xs text-muted-foreground leading-snug">AI-powered resume analysis with fix suggestions</div>
                    </div>
                  </div>
                </div>

                {/* second */}
                <div className="p-3 bg-card/40 border border-border/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">ATS Checker</div>
                      <div className="text-xs text-muted-foreground leading-snug">Optimize for Applicant Tracking Systems</div>
                    </div>
                  </div>
                </div>

                {/* third */}
                <div className="p-3 bg-card/40 border border-border/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Resume Builder</div>
                      <div className="text-xs text-muted-foreground leading-snug">Create recruiter-ready resumes</div>
                    </div>
                  </div>
                </div>

                {/* fourth */}
                <div className="p-3 bg-card/40 border border-border/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Job Recommendations</div>
                      <div className="text-xs text-muted-foreground leading-snug">Personalized job matches</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </header>
  );
}
