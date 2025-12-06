"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  CheckCircle, 
  Upload, 
  FileSearch, 
  Target, 
  Brain, 
  Rocket,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const steps = [
  {  
    number: "01",
    title: "Upload Your Resume",
    description: "Drop your existing resume or create one from scratch using our AI-powered builder.",
    icon: Upload,
    gradient: "from-blue-500 via-blue-400 to-cyan-400",
    shadowColor: "shadow-blue-500/20",
    borderGlow: "hover:shadow-blue-500/30",
    iconBg: "bg-blue-500/20",
    accentColor: "text-blue-400",
  },
  {
    number: "02",
    title: "ATS Optimization",
    description: "Get instant ATS compatibility scores and actionable suggestions to beat the bots.",
    icon: FileSearch,
    gradient: "from-purple-500 via-violet-400 to-fuchsia-400",
    shadowColor: "shadow-purple-500/20",
    borderGlow: "hover:shadow-purple-500/30",
    iconBg: "bg-purple-500/20",
    accentColor: "text-purple-400",
  },
  {
    number: "03",
    title: "Smart Job Matching",
    description: "AI analyzes your skills and experience to find perfect job opportunities for you.",
    icon: Target,
    gradient: "from-orange-500 via-amber-400 to-yellow-400",
    shadowColor: "shadow-orange-500/20",
    borderGlow: "hover:shadow-orange-500/30",
    iconBg: "bg-orange-500/20",
    accentColor: "text-orange-400",
  },
  {
    number: "04",
    title: "Skill Gap Analysis",
    description: "Discover missing skills and get personalized learning paths to level up your career.",
    icon: Brain,
    gradient: "from-emerald-500 via-teal-400 to-cyan-400",
    shadowColor: "shadow-emerald-500/20",
    borderGlow: "hover:shadow-emerald-500/30",
    iconBg: "bg-emerald-500/20",
    accentColor: "text-emerald-400",
  },
];

export default function About() {
  const ref = React.useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Adjust horizontal scroll based on screen size
  // Mobile needs more scroll range to show all cards fully
  const x = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["0%", isMobile ? "-82%" : "-70%"]
  );

  // Individual card transformations based on scroll
  const rotate1 = useTransform(scrollYProgress, [0, 0.2], [5, 0]);
  const rotate2 = useTransform(scrollYProgress, [0.1, 0.35], [8, 0]);
  const rotate3 = useTransform(scrollYProgress, [0.25, 0.5], [-5, 0]);
  const rotate4 = useTransform(scrollYProgress, [0.4, 0.65], [6, 0]);
  
  const scale1 = useTransform(scrollYProgress, [0, 0.15], [0.9, 1]);
  const scale2 = useTransform(scrollYProgress, [0.1, 0.3], [0.85, 1]);
  const scale3 = useTransform(scrollYProgress, [0.25, 0.45], [0.9, 1]);
  const scale4 = useTransform(scrollYProgress, [0.4, 0.6], [0.85, 1]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.1], [0.5, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.1, 0.25], [0.3, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.25, 0.4], [0.3, 1]);
  const opacity4 = useTransform(scrollYProgress, [0.4, 0.55], [0.3, 1]);
  const opacityCTA = useTransform(scrollYProgress, [0.55, 0.7], [0.3, 1]);

  const cardTransforms = [
    { rotate: rotate1, scale: scale1, opacity: opacity1 },
    { rotate: rotate2, scale: scale2, opacity: opacity2 },
    { rotate: rotate3, scale: scale3, opacity: opacity3 },
    { rotate: rotate4, scale: scale4, opacity: opacity4 },
  ];

  return (
    <section ref={ref} className="relative h-[450vh] md:h-[400vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Horizontal Scroll Container */}
        <motion.div
          style={{ x }}
          className="flex h-full items-center gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-16"
        >
          {/* INTRO CARD */}
          <motion.div 
            style={{ opacity: opacity1 }}
            className="w-[85vw] sm:w-[70vw] lg:w-[40vw] shrink-0 flex flex-col justify-center"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                  AI-Powered Career Platform
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  Career-focused AI,
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  built for impact
                </span>
              </h3>

              <p className="text-muted-foreground text-base sm:text-lg max-w-md">
                Cerevo helps individuals find better opportunities, improve resumes,
                and learn job-ready skills with AI-powered insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                    <CheckCircle className="text-primary h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">AI-powered insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <CheckCircle className="text-purple-400 h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">All in one place</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP CARDS */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const transforms = cardTransforms[index];
            
            return (
              <motion.div
                key={step.number}
                style={{
                  rotate: transforms.rotate,
                  scale: transforms.scale,
                  opacity: transforms.opacity,
                }}
                className={`
                  w-[85vw] sm:w-[70vw] lg:w-[380px] shrink-0 
                  group relative overflow-hidden
                  bg-gradient-to-br from-card/80 via-card/60 to-card/40
                  backdrop-blur-xl border border-white/10
                  rounded-3xl p-6 sm:p-8
                  shadow-2xl ${step.shadowColor}
                  hover:shadow-3xl ${step.borderGlow}
                  transition-all duration-500
                `}
              >
                {/* Gradient Orb Background */}
                <div className={`
                  absolute -top-20 -right-20 w-40 h-40 
                  bg-gradient-to-br ${step.gradient} 
                  rounded-full blur-3xl opacity-20 
                  group-hover:opacity-40 group-hover:scale-125
                  transition-all duration-700
                `} />
                
                {/* Step Number */}
                <div className={`
                  absolute top-6 right-6 text-6xl sm:text-7xl font-black 
                  bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent 
                  opacity-10 group-hover:opacity-20 transition-opacity duration-500
                `}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`
                  w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${step.iconBg}
                  flex items-center justify-center mb-6
                  group-hover:scale-110 transition-transform duration-500
                `}>
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${step.accentColor}`} />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`
                      text-xs font-bold px-3 py-1 rounded-full
                      bg-gradient-to-r ${step.gradient} text-white
                    `}>
                      STEP {step.number}
                    </span>
                  </div>
                  
                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    {step.title}
                  </h4>
                  
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Gradient Line */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1
                  bg-gradient-to-r ${step.gradient}
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                `} />
              </motion.div>
            );
          })}

          {/* CTA CARD */}
          <motion.div
            style={{ opacity: opacityCTA }}
            className="w-[85vw] sm:w-[70vw] lg:w-[450px] shrink-0 mr-8 sm:mr-16 lg:mr-20"
          >
            <div className="
              relative overflow-hidden
              bg-gradient-to-br from-primary/20 via-cyan-500/10 to-teal-500/20
              backdrop-blur-xl border border-primary/30
              rounded-3xl p-8 sm:p-10
              shadow-2xl shadow-primary/10
            ">
              {/* Animated Background Orbs */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-primary to-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

              {/* Content */}
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-2xl sm:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Ready to 
                    </span>
                    <span className="bg-gradient-to-r from-primary via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                      {" "}transform
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      your career?
                    </span>
                  </h4>
                  
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Join thousands of professionals using Cerevo to land their dream jobs faster.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/signup"
                    className="
                      group/btn flex items-center justify-center gap-2 
                      px-6 py-3 rounded-xl font-semibold text-white
                      bg-gradient-to-r from-primary via-cyan-500 to-teal-500
                      hover:shadow-lg hover:shadow-primary/30 hover:scale-105
                      transition-all duration-300
                    "
                  >
                    Get Started Free
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className="
                      flex items-center justify-center gap-2 
                      px-6 py-3 rounded-xl font-semibold
                      border border-white/20 hover:bg-white/5
                      transition-all duration-300
                    "
                  >
                    View Dashboard
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">10K+</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">95%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">4.9★</div>
                    <div className="text-xs text-muted-foreground">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
