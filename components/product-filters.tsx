"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["category", "price"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const categories = [
    { id: "fish", name: "Fish", count: 12 },
    { id: "prawn", name: "Prawns & Shrimp", count: 8 },
    { id: "crab", name: "Crabs", count: 5 },
    { id: "lobster", name: "Lobsters", count: 3 },
    { id: "squid", name: "Squid & Octopus", count: 4 },
  ]

  const cuts = [
    { id: "whole", name: "Whole" },
    { id: "fillet", name: "Fillet" },
    { id: "cleaned", name: "Cleaned" },
  ]

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <Card className="p-4 border-0">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between font-bold text-foreground hover:text-primary transition"
        >
          Category
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("category") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("category") && (
          <div className="mt-4 space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange({ category: cat.id, checked: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">({cat.count})</span>
              </label>
            ))}
          </div>
        )}
      </Card>

      {/* Price Filter */}
      <Card className="p-4 border-0">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-bold text-foreground hover:text-primary transition"
        >
          Price Range
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("price") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("price") && (
          <div className="mt-4 space-y-3">
            <input
              type="range"
              min="0"
              max="1000"
              className="w-full"
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹0</span>
              <span>₹1000</span>
            </div>
          </div>
        )}
      </Card>

      {/* Cut Filter */}
      <Card className="p-4 border-0">
        <button
          onClick={() => toggleSection("cut")}
          className="w-full flex items-center justify-between font-bold text-foreground hover:text-primary transition"
        >
          Cut Type
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("cut") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("cut") && (
          <div className="mt-4 space-y-2">
            {cuts.map((cut) => (
              <label key={cut.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange({ cut: cut.id, checked: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-foreground">{cut.name}</span>
              </label>
            ))}
          </div>
        )}
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full bg-transparent" onClick={() => onFilterChange({ reset: true })}>
        Clear All Filters
      </Button>
    </div>
  )
}
