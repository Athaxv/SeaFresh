"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ShoppingCart, Heart, Truck, Shield, Leaf } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          // If API returns array, find by id
          const foundProduct = Array.isArray(data) 
            ? data.find((p: any) => p.id === params.id) 
            : data
          setProduct(foundProduct || null)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    
    addItem(product, quantity)
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/shop')}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    )
  }

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground">
          <a href="/shop" className="hover:text-primary">
            Shop
          </a>
          {" / "}
          <a href={`/shop?category=${product.category}`} className="hover:text-primary">
            {product.category}
          </a>
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-2xl overflow-hidden h-96 md:h-full">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className="bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary">
                  <img src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{formatPrice(discountedPrice)}</span>
                {product.discount && (
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                )}
              </div>
              <p className="text-sm text-green-600 font-semibold">
                Save {formatPrice(product.price - discountedPrice)}
              </p>
            </div>

            {/* Details */}
            <Card className="p-4 border-0 bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Weight</p>
                  <p className="font-semibold text-foreground">{product.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Cut Type</p>
                  <p className="font-semibold text-foreground capitalize">{product.cut}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Origin</p>
                  <p className="font-semibold text-foreground">{product.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Stock</p>
                  <p className="font-semibold text-green-600">In Stock</p>
                </div>
              </div>
            </Card>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-muted transition">
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{product.stock} available</span>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Fast delivery within 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Quality assured & certified</span>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Hygienic packaging with ice packs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition & Reviews */}
        <div className="grid md:grid-cols-2 gap-12 mt-16 pt-12 border-t border-border">
          {/* Nutrition Facts */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Nutrition Facts</h2>
            <Card className="p-6 border-0 bg-muted/50">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-foreground">Protein</span>
                  <span className="font-semibold">{product.nutrition.protein}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Fat</span>
                  <span className="font-semibold">{product.nutrition.fat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Carbs</span>
                  <span className="font-semibold">{product.nutrition.carbs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Calories</span>
                  <span className="font-semibold">{product.nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Omega-3</span>
                  <span className="font-semibold">{product.nutrition.omega3}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <Card key={review.id} className="p-4 border-0 bg-muted/50">
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
