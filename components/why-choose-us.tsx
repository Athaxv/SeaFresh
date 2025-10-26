"use client"

import { Card } from "@/components/ui/card"
import { Zap, Leaf, Truck, Shield } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Fresh Catch",
    description: "Sourced directly from coastal waters and delivered within 24 hours to ensure maximum freshness.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery service with real-time tracking to your doorstep.",
  },
  {
    icon: Leaf,
    title: "Hygienic Packaging",
    description: "Premium insulated packaging with ice packs to maintain optimal temperature and freshness.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every product is inspected and certified for quality, safety, and freshness standards.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose SeaFresh?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering the finest seafood experience with uncompromising quality and service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 border-0 bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary p-2.5 mb-4">
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
