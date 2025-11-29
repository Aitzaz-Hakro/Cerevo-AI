"use client"

import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LightRaysBg from "@/components/LightRaysBg"

function LoadingFallback() {
  return (
    <div className="h-16 bg-background/80 backdrop-blur-md border-b border-border/50" />
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <LightRaysBg
          raysOrigin="left"
          raysColor="#2dd4bf"
          raysSpeed={1.2}
          lightSpread={1.5}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.08}
          distortion={0.03}
          pulsating={false}
          fadeDistance={1.2}
          saturation={0.9}
        />
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Header />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
