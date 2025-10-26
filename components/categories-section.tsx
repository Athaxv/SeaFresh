"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Fish, Ship as Shrimp, Grab as Crab, Crown, Zap, Package } from "lucide-react"

const categories = [
  {
    id: "fish",
    name: "Fish",
    description: "Fresh whole & fillet cuts",
    icon: Fish,
    color: "from-blue-500 to-cyan-500",
    count: "12+ varieties",
  },
  {
    id: "prawn",
    name: "Prawns & Shrimp",
    description: "Premium cleaned prawns",
    icon: Shrimp,
    color: "from-pink-500 to-rose-500",
    count: "8+ varieties",
  },
  {
    id: "crab",
    name: "Crabs",
    description: "Live & fresh crabs",
    icon: Crab,
    color: "from-orange-500 to-red-500",
    count: "5+ varieties",
  },
  {
    id: "lobster",
    name: "Lobsters",
    description: "Premium lobster tails",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    count: "3+ varieties",
  },
  {
    id: "squid",
    name: "Squid & Octopus",
    description: "Fresh cleaned squid",
    icon: Zap,
    color: "from-indigo-500 to-blue-500",
    count: "4+ varieties",
  },
  {
    id: "combo",
    name: "Combo Packs",
    description: "Curated seafood bundles",
    icon: Package,
    color: "from-teal-500 to-green-500",
    count: "6+ combos",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore Our Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover a wide variety of premium seafood, carefully selected and delivered fresh to your door
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/shop?category=${category.id}`}>
                <Card className="group h-full p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-secondary/5">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} p-3 mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <p className="text-xs font-semibold text-primary">{category.count}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
