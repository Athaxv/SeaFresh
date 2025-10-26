"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Heart, Plus } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()
  const discountedPrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding) return
    
    try {
      setIsAdding(true)
      
      // Call custom handler if provided, otherwise use context
      if (onAddToCart) {
        onAddToCart(product)
      } else {
        addItem(product, 1)
      }
      
      toast.success(`${product.name} added to cart!`, {
        description: "Browse more or checkout now",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setTimeout(() => setIsAdding(false), 500)
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group h-full overflow-hidden border-0 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted h-64">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isFeatured && (
              <div className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">Featured</div>
            )}
            {product.discount && (
              <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">-{product.discount}%</div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all z-10"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`absolute bottom-3 right-3 p-2 rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10 ${
              isAdding ? "animate-pulse" : ""
            }`}
          >
            {isAdding ? <Plus className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">{product.category}</p>
            <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition">
              {product.name}
            </h3>
          </div>

          {/* Details */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              {product.weight} • {product.cut}
            </p>
            <p className="text-primary font-semibold">{product.origin}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.round(product.rating) ? "text-accent" : "text-muted"}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews?.length || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground">{formatPrice(discountedPrice)}</span>
            {product.discount && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
