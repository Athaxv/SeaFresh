"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, ShoppingCart, Heart, Truck, Shield, Leaf } from "lucide-react"
import { formatPrice } from "@/lib/utils"

// Mock product detail
const MOCK_PRODUCT = {
  id: "1",
  name: "Medium Prawns - Cleaned",
  description: "Fresh, medium-sized prawns, cleaned and ready to cook",
  category: "prawn",
  price: 450,
  weight: "500g",
  cut: "cleaned",
  image: "/fresh-medium-prawns-on-wooden-board.jpg",
  images: ["/fresh-medium-prawns-on-wooden-board.jpg"],
  stock: 50,
  rating: 4.8,
  reviews: [
    {
      id: "1",
      userId: "user1",
      productId: "1",
      rating: 5,
      comment: "Excellent quality and freshness!",
      createdAt: new Date(),
    },
  ],
  nutrition: {
    protein: "24g",
    fat: "0.3g",
    carbs: "0g",
    calories: "99",
    omega3: "0.3g",
  },
  origin: "Coastal India",
  tags: ["bestseller", "fresh"],
  discount: 10,
  isFeatured: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const discountedPrice = MOCK_PRODUCT.discount
    ? Math.round(MOCK_PRODUCT.price * (1 - MOCK_PRODUCT.discount / 100))
    : MOCK_PRODUCT.price

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
          <a href={`/shop?category=${MOCK_PRODUCT.category}`} className="hover:text-primary">
            {MOCK_PRODUCT.category}
          </a>
          {" / "}
          <span className="text-foreground">{MOCK_PRODUCT.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-2xl overflow-hidden h-96 md:h-full">
              <img
                src={MOCK_PRODUCT.image || "/placeholder.svg"}
                alt={MOCK_PRODUCT.name}
                className="w-full h-full object-cover"
              />
              {MOCK_PRODUCT.discount && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                  -{MOCK_PRODUCT.discount}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MOCK_PRODUCT.images.map((img, idx) => (
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
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">{MOCK_PRODUCT.category}</p>
              <h1 className="text-4xl font-bold text-foreground mb-2">{MOCK_PRODUCT.name}</h1>
              <p className="text-muted-foreground">{MOCK_PRODUCT.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(MOCK_PRODUCT.rating) ? "fill-accent text-accent" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {MOCK_PRODUCT.rating} ({MOCK_PRODUCT.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{formatPrice(discountedPrice)}</span>
                {MOCK_PRODUCT.discount && (
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(MOCK_PRODUCT.price)}</span>
                )}
              </div>
              <p className="text-sm text-green-600 font-semibold">
                Save {formatPrice(MOCK_PRODUCT.price - discountedPrice)}
              </p>
            </div>

            {/* Details */}
            <Card className="p-4 border-0 bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Weight</p>
                  <p className="font-semibold text-foreground">{MOCK_PRODUCT.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Cut Type</p>
                  <p className="font-semibold text-foreground capitalize">{MOCK_PRODUCT.cut}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Origin</p>
                  <p className="font-semibold text-foreground">{MOCK_PRODUCT.origin}</p>
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
                <span className="text-sm text-muted-foreground">{MOCK_PRODUCT.stock} available</span>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary">
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
                  <span className="font-semibold">{MOCK_PRODUCT.nutrition.protein}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Fat</span>
                  <span className="font-semibold">{MOCK_PRODUCT.nutrition.fat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Carbs</span>
                  <span className="font-semibold">{MOCK_PRODUCT.nutrition.carbs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Calories</span>
                  <span className="font-semibold">{MOCK_PRODUCT.nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Omega-3</span>
                  <span className="font-semibold">{MOCK_PRODUCT.nutrition.omega3}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {MOCK_PRODUCT.reviews.map((review) => (
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
