"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Store, ShoppingBag, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pt-20 pb-32">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-secondary/20 rounded-full">
                <p className="text-sm font-semibold text-secondary">India's Premier Seafood Marketplace</p>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Premium Seafood,{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Delivered Fresh
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Experience the finest quality seafood from trusted sellers across India. Fresh catch delivered to your doorstep
                within 24 hours, guaranteed quality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/seller/register">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Store className="w-4 h-4" />
                  Become a Seller
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Sellers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">24hrs</p>
                <p className="text-sm text-muted-foreground">Fresh Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl" />
            <img
              src="/fresh-premium-seafood-prawns-fish-on-ice.jpg"
              alt="Fresh Seafood"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
            {/* Floating badge */}
            <div className="absolute bottom-6 right-6 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">100% Fresh</p>
                  <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
