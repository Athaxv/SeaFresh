"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { initializeDatabase } from "@/lib/db"

export default function Home() {
  useEffect(() => {
    // Initialize database with sample data
    initializeDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}
