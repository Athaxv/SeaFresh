"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductSort } from "@/components/product-sort"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ActiveFilterChips, type ActiveFilter } from "@/components/active-filter-chips"
import { ProductFiltersHorizontal } from "@/components/product-filters-horizontal"
import { Pagination } from "@/components/pagination"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

const PRODUCTS_PER_PAGE = 12

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Get URL params
  const searchQuery = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "popularity"

  // State for filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  
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

  // Update URL params
  const updateUrlParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    router.push(`/shop?${params.toString()}`)
  }, [router, searchParams])

  // Parse filters from URL and set active filters
  useEffect(() => {
    const filters: ActiveFilter[] = []
    
    if (searchQuery) {
      filters.push({
        key: "search",
        label: "Search",
        value: searchQuery,
      })
    }
    
    if (category) {
      filters.push({
        key: "category",
        label: "Category",
        value: category,
      })
    }
    
    const priceRange = searchParams.get("priceRange")
    if (priceRange) {
      const label = priceRange === "0-500" ? "₹0-₹500"
        : priceRange === "500-1000" ? "₹500-₹1,000"
        : priceRange === "1000-2000" ? "₹1,000-₹2,000"
        : "₹2,000+"
      filters.push({ key: "priceRange", label: "Price", value: label })
    }
    
    const cutType = searchParams.get("cutType")
    if (cutType) {
      filters.push({ key: "cutType", label: "Cut Type", value: cutType })
    }
    
    const rating = searchParams.get("rating")
    if (rating) {
      filters.push({ key: "rating", label: "Rating", value: rating })
    }
    
    setActiveFilters(filters)
  }, [searchParams, category, searchQuery])

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.origin.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }

    // Price range filter
    const priceRange = searchParams.get("priceRange")
    if (priceRange) {
      if (priceRange === "0-500") {
        filtered = filtered.filter((p) => p.price >= 0 && p.price <= 500)
      } else if (priceRange === "500-1000") {
        filtered = filtered.filter((p) => p.price > 500 && p.price <= 1000)
      } else if (priceRange === "1000-2000") {
        filtered = filtered.filter((p) => p.price > 1000 && p.price <= 2000)
      } else if (priceRange === "2000+") {
        filtered = filtered.filter((p) => p.price > 2000)
      }
    }

    // Cut type filter
    const cutType = searchParams.get("cutType")
    if (cutType) {
      filtered = filtered.filter((p) => p.cut === cutType)
    }

    // Rating filter
    const rating = searchParams.get("rating")
    if (rating) {
      if (rating === "5") {
        filtered = filtered.filter((p) => p.rating === 5)
      } else if (rating === "4+") {
        filtered = filtered.filter((p) => p.rating >= 4)
      } else if (rating === "3+") {
        filtered = filtered.filter((p) => p.rating >= 3)
      }
    }

    // Sort products
    switch (sort) {
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
  }, [products, searchQuery, category, sort, searchParams])

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle filter changes
  const handleFilterChange = useCallback((filters: any) => {
    if (filters.category) {
      updateUrlParams({ category: filters.category })
    }
    if (filters.priceRange) {
      updateUrlParams({ priceRange: filters.priceRange, page: null })
    }
    if (filters.cutType) {
      updateUrlParams({ cutType: filters.cutType, page: null })
    }
    if (filters.rating) {
      updateUrlParams({ rating: filters.rating, page: null })
    }
    if (filters.clearAll) {
      router.push("/shop")
    }
  }, [updateUrlParams, router])

  // Remove individual filter
  const handleRemoveFilter = useCallback((key: string) => {
    switch (key) {
      case "search":
        updateUrlParams({ search: null })
        break
      case "category":
        updateUrlParams({ category: null, page: null })
        break
      case "priceRange":
        updateUrlParams({ priceRange: null, page: null })
        break
      case "cutType":
        updateUrlParams({ cutType: null, page: null })
        break
      case "rating":
        updateUrlParams({ rating: null, page: null })
        break
      default:
        updateUrlParams({ [key]: null })
    }
  }, [updateUrlParams])

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    updateUrlParams({ sort: sortBy, page: null })
  }

  // Clear search
  const handleClearSearch = () => {
    updateUrlParams({ search: null, page: null })
    toast.success("Search cleared")
  }

  // Breadcrumbs
  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    ...(category ? [{ label: category, href: undefined }] : []),
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <ProductGridSkeleton count={12} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 py-12 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            {searchQuery ? `Search: "${searchQuery}"` : "Premium Seafood Collection"}
          </h1>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Found ${filteredProducts.length} products matching "${searchQuery}"`
              : `Discover our handpicked selection of the freshest seafood, sourced directly from coastal waters`}
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="mt-4"
            >
              <X className="w-4 h-4 mr-2" />
              Clear search
            </Button>
          )}
        </div>
      </div>

      {/* Filters Bar - Horizontal */}
      <ProductFiltersHorizontal
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Filters */}
        <ActiveFilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={() => router.push("/shop")}
        />

        {/* Top Bar: Product Count & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Showing <span className="text-primary font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
              <span className="text-primary font-semibold">{filteredProducts.length}</span> products
            </p>
          </div>
            <ProductSort onSortChange={handleSortChange} currentValue={sort || "popularity"} />
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Filter className="w-8 h-8 text-primary/50" />
              </div>
            </div>
            <p className="text-lg font-medium text-foreground mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => router.push("/shop")}>Clear All Filters</Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
