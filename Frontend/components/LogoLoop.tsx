// components/LogoLoop.tsx
"use client"

import React from "react"

const partners = [
  { name: "LinkedIn" },
  { name: "Indeed" },
  { name: "Glassdoor" },
  { name: "TechCrunch" },
  { name: "Monster" },
  { name: "CareerBuilder" },
]

export default function LogoLoop({ speed = 20 }: { speed?: number }) {
  // Create two sets for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners]
  
  return (
    <div className="relative overflow-hidden py-8 w-full">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" />
      
      <div className="logo-scroll-wrapper">
        <div className="logo-scroll-content flex gap-8">
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`${partner.name}-${index}`} 
              className="flex items-center justify-center flex-shrink-0"
            >
              <div className="px-6 py-3 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm text-muted-foreground text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .logo-scroll-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .logo-scroll-content {
          animation: scroll-left ${speed}s linear infinite;
          width: max-content;
        }

        .logo-scroll-content:hover {
          animation-play-state: paused;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
