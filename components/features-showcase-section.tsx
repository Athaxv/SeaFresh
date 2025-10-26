"use client"

import { Card } from "@/components/ui/card"
import { Shield, Truck, CreditCard, HeadphonesIcon, PackageCheck, MapPin } from "lucide-react"

const features = [
  {
    icon: PackageCheck,
    title: "Quality Assurance",
    description: "Every product is verified for freshness and quality before delivery.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Temperature-controlled delivery within 24 hours across major cities.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Multiple payment options with 100% secure transactions.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Money Back Guarantee",
    description: "Not satisfied? Get a full refund within 24 hours of delivery.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Track your order in real-time from ocean to your doorstep.",
    color: "from-teal-500 to-green-500"
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our customer support team is always ready to assist you.",
    color: "from-indigo-500 to-blue-500"
  },
]

export function FeaturesShowcaseSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4 backdrop-blur-sm border border-primary/20">
            <p className="text-sm font-semibold text-primary">Premium Features</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Customers Love SeaFresh
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're committed to providing the best seafood shopping experience with unmatched quality and service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className={`group p-6 border-0 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}


