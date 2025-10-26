"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProductsSection } from "@/components/featured-products-section"
import { FeaturesShowcaseSection } from "@/components/features-showcase-section"
import { CategoriesSection } from "@/components/categories-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { SellerBenefitsSection } from "@/components/seller-benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedProductsSection />
      <FeaturesShowcaseSection />
      <CategoriesSection />
      <SellerBenefitsSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
