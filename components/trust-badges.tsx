"use client"

import { Shield, Truck, RefreshCw, Award } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "Your payment is safe",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders above ₹500",
    },
    {
      icon: RefreshCw,
      title: "Fresh Guarantee",
      description: "100% fresh seafood",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handpicked for you",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
            <badge.icon className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
        </div>
      ))}
    </div>
  )
}




