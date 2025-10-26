"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Award, Leaf, Truck, Users } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">About SeaFresh</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Bringing the ocean's finest directly to your table with premium quality and uncompromising freshness.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                SeaFresh was founded with a simple mission: to revolutionize how Indians access premium seafood. We
                believe that everyone deserves access to the freshest, highest-quality seafood without compromising on
                convenience or affordability.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Starting from a small operation in Mumbai, we've grown to serve thousands of customers across India. Our
                commitment to quality, freshness, and customer satisfaction remains unwavering.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every product we deliver is carefully selected, handled with precision, and delivered fresh to your
                doorstep within hours of processing.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌊</div>
                <p className="text-muted-foreground">Premium Seafood Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-lg transition">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Quality First</h3>
              <p className="text-muted-foreground">
                We source only the finest seafood from trusted suppliers and maintain strict quality standards.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-lg transition">
              <Leaf className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to sustainable fishing practices and environmental responsibility.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-lg transition">
              <Truck className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Fresh delivery within hours. We ensure your seafood arrives at peak freshness.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-lg transition">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Customer Care</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We're here to help 24/7 with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">100+</div>
              <p className="text-muted-foreground">Product Varieties</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">24/7</div>
              <p className="text-muted-foreground">Customer Support</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">5★</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Team</h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Our dedicated team of seafood experts, logistics professionals, and customer service specialists work
            tirelessly to bring you the best experience.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background rounded-xl overflow-hidden border border-border hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-48 flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">Team Member {i}</h3>
                  <p className="text-sm text-accent mb-3">Leadership Role</p>
                  <p className="text-muted-foreground text-sm">
                    Dedicated to delivering excellence and ensuring customer satisfaction.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
