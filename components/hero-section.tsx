"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Store, ShoppingBag, TrendingUp, Search, CheckCircle, Clock, Shield, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [animatedStats, setAnimatedStats] = useState({ products: 0, sellers: 0 })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Animate stats counter
  useEffect(() => {
    const animateCount = (target: number, setter: (val: number) => void, duration = 2000) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
    }

    animateCount(500, (val) => setAnimatedStats(prev => ({ ...prev, products: val })))
    animateCount(50, (val) => setAnimatedStats(prev => ({ ...prev, sellers: val })))
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pt-24 pb-32">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-md">
                <p className="text-sm font-semibold text-primary">🏆 India's Premier Seafood Marketplace</p>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Premium Seafood,{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Delivered Fresh
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
                Experience the finest quality seafood from trusted sellers across India. Fresh catch delivered to your doorstep
                within 24 hours, guaranteed quality.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-lg">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for fish, prawns, crabs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-lg hover:shadow-xl"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto text-base px-8 py-6 group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/seller/register">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 w-full sm:w-auto border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 px-8 py-6"
                >
                  <Store className="w-5 h-5" />
                  Become a Seller
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="group">
                <p className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform inline-block">
                  {animatedStats.products}+
                </p>
                <p className="text-sm text-muted-foreground mt-1">Products</p>
              </div>
              <div className="group">
                <p className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform inline-block">
                  {animatedStats.sellers}+
                </p>
                <p className="text-sm text-muted-foreground mt-1">Sellers</p>
              </div>
              <div className="group">
                <p className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform inline-block">
                  24hrs
                </p>
                <p className="text-sm text-muted-foreground mt-1">Fresh Delivery</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 items-center pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Quality Guaranteed
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-blue-600" />
                Express Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4 text-primary" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-purple-600" />
                Money Back
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-[500px] lg:h-[600px] group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <img
              src="/fresh-premium-seafood-prawns-fish-on-ice.jpg"
              alt="Fresh Seafood"
              className="relative w-full h-full object-cover rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
            />
            
            {/* Floating Trust Badge */}
            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-primary/10 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">100% Fresh</p>
                  <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
                </div>
              </div>
            </div>

            {/* Urgency Badge */}
            <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full shadow-xl animate-pulse">
              <p className="text-sm font-semibold">⚡ Order in next 2 hours for today's delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
