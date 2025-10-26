"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Home Chef",
    content:
      "The quality of seafood is exceptional! Everything arrives fresh and the packaging is perfect. Highly recommended!",
    rating: 5,
    image: "/woman-avatar.png",
  },
  {
    name: "Rajesh Kumar",
    role: "Restaurant Owner",
    content:
      "SeaFresh has become our trusted supplier. Consistent quality, reliable delivery, and excellent customer service.",
    rating: 5,
    image: "/man-avatar.png",
  },
  {
    name: "Anjali Patel",
    role: "Food Blogger",
    content: "The variety and freshness are unmatched. My followers love the recipes I create with SeaFresh products!",
    rating: 5,
    image: "/woman-avatar-2.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Loved by Our Customers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SeaFresh for their seafood needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
