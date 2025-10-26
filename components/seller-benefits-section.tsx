"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Store, TrendingUp, Users, Zap, ArrowRight } from "lucide-react"

const benefits = [
  {
    icon: Store,
    title: "Easy Setup",
    description: "Get your online store running in minutes with our simple seller dashboard.",
  },
  {
    icon: Users,
    title: "Ready Customers",
    description: "Access thousands of seafood enthusiasts actively looking to buy.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Expand your reach beyond local markets and increase your revenue.",
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Get paid quickly with our secure and reliable payment system.",
  },
]

export function SellerBenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/20 rounded-full">
              <p className="text-sm font-semibold text-primary">For Sellers</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Start Selling Your Fresh Seafood Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our marketplace and reach customers across India. Whether you're a fisherman, wholesaler, or retailer,
              SeaFresh provides the platform you need to grow your seafood business.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/seller/register">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Register as Seller
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/seller/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Seller Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">0%</div>
              <div className="text-sm text-muted-foreground">Commission for First Month</div>
            </Card>
            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </Card>
            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Buyers</div>
            </Card>
            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">Fast</div>
              <div className="text-sm text-muted-foreground">Same Day Payouts</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}




