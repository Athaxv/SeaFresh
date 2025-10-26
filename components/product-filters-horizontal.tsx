"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { ActiveFilter } from "./active-filter-chips"

interface ProductFiltersHorizontalProps {
  onFilterChange: (filters: any) => void
  activeFilters: ActiveFilter[]
  onRemoveFilter: (key: string) => void
}

export function ProductFiltersHorizontal({
  onFilterChange,
  activeFilters,
  onRemoveFilter,
}: ProductFiltersHorizontalProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const categories = [
    { value: "FISH", label: "Fish" },
    { value: "PRAWN", label: "Prawns & Shrimp" },
    { value: "CRAB", label: "Crabs" },
    { value: "SQUID", label: "Squid & Octopus" },
    { value: "COMBO", label: "Combo Packs" },
  ]

  const priceRanges = [
    { value: "0-500", label: "₹0 - ₹500" },
    { value: "500-1000", label: "₹500 - ₹1,000" },
    { value: "1000-2000", label: "₹1,000 - ₹2,000" },
    { value: "2000+", label: "₹2,000+" },
  ]

  const cuts = [
    { value: "whole", label: "Whole" },
    { value: "fillet", label: "Fillet" },
    { value: "cleaned", label: "Cleaned" },
  ]

  const ratings = [
    { value: "5", label: "5 Stars" },
    { value: "4+", label: "4+ Stars" },
    { value: "3+", label: "3+ Stars" },
  ]

  const handleCategoryChange = (value: string) => {
    onFilterChange({ category: value })
  }

  const handlePriceChange = (value: string) => {
    onFilterChange({ priceRange: value })
  }

  const handleCutChange = (value: string) => {
    onFilterChange({ cutType: value })
  }

  const handleRatingChange = (value: string) => {
    onFilterChange({ rating: value })
  }

  const getCurrentFilterValue = (filterKey: string) => {
    return activeFilters.find((f) => f.key === filterKey)?.value || ""
  }

  const FilterDesktop = () => (
    <div className="flex items-center gap-4 py-4 overflow-x-auto">
      {/* Category Filter */}
      <div className="flex-shrink-0">
        <Select value={getCurrentFilterValue("category") || undefined} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Filter */}
      <div className="flex-shrink-0">
        <Select value={getCurrentFilterValue("priceRange") || undefined} onValueChange={handlePriceChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cut Type Filter */}
      <div className="flex-shrink-0">
        <Select value={getCurrentFilterValue("cutType") || undefined} onValueChange={handleCutChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cut Type" />
          </SelectTrigger>
          <SelectContent>
            {cuts.map((cut) => (
              <SelectItem key={cut.value} value={cut.value}>
                {cut.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="flex-shrink-0">
        <Select value={getCurrentFilterValue("rating") || undefined} onValueChange={handleRatingChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Min Rating" />
          </SelectTrigger>
          <SelectContent>
            {ratings.map((rating) => (
              <SelectItem key={rating.value} value={rating.value}>
                {rating.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onFilterChange({ clearAll: true })
          }}
          className="flex-shrink-0"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )

  const FilterMobile = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={getCurrentFilterValue("category") || undefined} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Price Range</label>
            <Select value={getCurrentFilterValue("priceRange") || undefined} onValueChange={handlePriceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cut Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Cut Type</label>
            <Select value={getCurrentFilterValue("cutType") || undefined} onValueChange={handleCutChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select cut type" />
              </SelectTrigger>
              <SelectContent>
                {cuts.map((cut) => (
                  <SelectItem key={cut.value} value={cut.value}>
                    {cut.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
            <Select value={getCurrentFilterValue("rating") || undefined} onValueChange={handleRatingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map((rating) => (
                  <SelectItem key={rating.value} value={rating.value}>
                    {rating.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onFilterChange({ clearAll: true })
              setIsMobileMenuOpen(false)
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur sticky top-[64px] z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FilterDesktop />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden py-3">
          <FilterMobile />
        </div>
      </div>
    </div>
  )
}

