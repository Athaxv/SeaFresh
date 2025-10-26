"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import type { Product } from "@/lib/types"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product)
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter((p) => p.price >= min && p.price <= max)
    }

    if (filters.cutType) {
      filtered = filtered.filter((p) => p.cut === filters.cutType)
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return filtered
  }, [products, filters, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/5 py-16 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3 tracking-tight">
            Premium Seafood Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover our handpicked selection of the freshest seafood, sourced directly from coastal waters
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:sticky lg:top-24 h-fit bg-card rounded-xl border border-primary/10 p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters onFilterChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-primary/10">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Showing <span className="text-primary font-semibold">{filteredProducts.length}</span> products
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Object.keys(filters).length > 0 && "Filters applied"}
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <ProductSort onSortChange={setSortBy} />
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Filter className="w-8 h-8 text-primary/50" />
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground mb-2">No products found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for</p>
                <Button onClick={() => setFilters({})}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
