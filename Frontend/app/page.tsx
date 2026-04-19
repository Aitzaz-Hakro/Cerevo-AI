"use client"

import Team from "@/components/Team"
import CTA from "@/components/CTA"
import About from "@/components/About"
import Features from "@/components/Features"
import Hero from "@/components/Hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center space-y-20">
        {/* About Section */}
        <section>
          <About />
        </section>

        {/* Features Grid */}
        <section>
          <Features />
        </section>

        {/* CTA Section */}
        <section>
          <CTA />
        </section>

        <section>
          <Team />
        </section>
      </section>
    </main>
  )
}
