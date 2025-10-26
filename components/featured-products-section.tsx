"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

export function FeaturedProductsSection() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        // Filter for featured products or take first 8
        const featured = Array.isArray(data) 
          ? data.filter((p: any) => p.isFeatured).slice(0, 8)
          : []
        
        // If less than 8 featured, add more products
        if (featured.length < 8) {
          const additional = Array.isArray(data) 
            ? data.filter((p: any) => !featured.includes(p)).slice(0, 8 - featured.length)
            : []
          setProducts([...featured, ...additional])
        } else {
          setProducts(featured)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const handleAddToCart = (product: any) => {
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="flex-shrink-0 w-64 p-4 border-0">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <p className="text-sm font-semibold text-primary">Featured Products</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shop Our Best Sellers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked fresh seafood from trusted sellers. Quality guaranteed, delivered fresh.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="flex-shrink-0 w-72 p-0 border-0 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                        className="text-primary hover:scale-110 transition-transform"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-primary uppercase px-2 py-1 bg-primary/10 rounded">
                      {product.category}
                    </span>
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.rating || 4.0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount ? (
                        <div>
                          <span className="text-2xl font-bold text-foreground">
                            {formatPrice(product.price * (1 - product.discount / 100))}
                          </span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-foreground">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground">{product.weight}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="gap-2 group/btn"
                    >
                      <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="gap-2">
              View All Products
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
