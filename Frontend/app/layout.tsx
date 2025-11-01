import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LightRaysBg from "@/components/LightRaysBg"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Cerevo - AI-Powered Career Guidance",
  description: "Get AI-powered career guidance, resume analysis, and job recommendations",
  keywords: ["Cerevo", "AI Career Guidance", "Resume Analysis", "Job Recommendations"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} font-sans antialiased relative`}>
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <LightRaysBg
            raysOrigin="top-center"
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
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
