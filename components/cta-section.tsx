"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Experience Fresh Seafood?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SeaFresh for their daily seafood needs.
            Fresh, quality seafood delivered right to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-primary hover:bg-white/90 shadow-xl w-full sm:w-auto"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}




