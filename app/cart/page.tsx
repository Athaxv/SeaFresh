"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice, calculateTax } from "@/lib/utils"

// Mock product data for cart items
const MOCK_PRODUCTS: Record<string, any> = {
  "1": {
    id: "1",
    name: "Medium Prawns - Cleaned",
    price: 450,
    image: "/fresh-medium-prawns-on-wooden-board.jpg",
    discount: 10,
  },
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const product = MOCK_PRODUCTS[item.productId]
    if (!product) return sum
    const discountedPrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price
    return sum + discountedPrice * item.quantity
  }, 0)

  const tax = calculateTax(subtotal)
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + tax - discount

  const applyCoupon = () => {
    if (couponCode === "SEAFRESH10") {
      setAppliedCoupon({ code: couponCode, discount: 10 })
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some fresh seafood to get started!</p>
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = MOCK_PRODUCTS[item.productId]
              if (!product) return null

              const discountedPrice = product.discount
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price

              return (
                <Card key={item.productId} className="p-4 border-0 flex gap-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.weight}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-foreground">{formatPrice(discountedPrice * item.quantity)}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(discountedPrice)} each</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 hover:bg-red-50 rounded text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}

            <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="p-6 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary">
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>

            {/* Coupon */}
            <Card className="p-4 border-0">
              <p className="text-sm font-semibold text-foreground mb-3">Apply Coupon</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" onClick={applyCoupon}>
                  Apply
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Try: SEAFRESH10</p>
            </Card>

            {/* Benefits */}
            <Card className="p-4 border-0 bg-muted/50">
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Free delivery on orders above ₹500</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>24-hour fresh guarantee</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Secure checkout</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
