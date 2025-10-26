"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice, calculateTax } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import { ProductQuantitySelector } from "@/components/product-quantity-selector"
import { TrustBadges } from "@/components/trust-badges"
import type { Product } from "@/lib/types"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getCartItemsWithProduct } = useCart()
  const [products, setProducts] = useState<Product[]>([])
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

  const cartItemsWithProducts = getCartItemsWithProduct(products)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)

  // Calculate totals
  const subtotal = cartItemsWithProducts.reduce((sum, item) => {
    const discountedPrice = item.product.discount
      ? Math.round(item.product.price * (1 - item.product.discount / 100))
      : item.product.price
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <EmptyState
            icon="cart"
            title="Your Cart is Empty"
            description="Add some fresh seafood to get started! Browse our premium collection and build your order."
            ctaLabel="Continue Shopping"
            ctaHref="/shop"
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-sm text-muted-foreground">{items.length} items in your cart</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItemsWithProducts.map((item) => {
              const discountedPrice = item.product.discount
                ? Math.round(item.product.price * (1 - item.product.discount / 100))
                : item.product.price

              return (
                <Card key={`${item.productId}-${item.product.id}`} className="p-4 border-0 flex gap-4">
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.weight} • {item.product.origin}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-primary">{formatPrice(discountedPrice)}</span>
                        {item.product.discount && (
                          <span className="text-xs text-muted-foreground line-through">{formatPrice(item.product.price)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <ProductQuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={(qty) => updateQuantity(item.productId, qty)}
                        min={1}
                      />
                      
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">{formatPrice(discountedPrice * item.quantity)}</p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
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
          <div className="lg:col-span-1 space-y-4">
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
            {!appliedCoupon && (
              <Card className="p-4 border-0 bg-card">
                <p className="text-sm font-semibold text-foreground mb-3">Apply Coupon</p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 text-sm"
                  />
                  <Button size="sm" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Try: SEAFRESH10</p>
              </Card>
            )}
            
            {appliedCoupon && (
              <Card className="p-4 border-0 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Coupon Applied</p>
                    <p className="text-xs text-green-600">{couponCode} - 10% off</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedCoupon(null)
                      setCouponCode("")
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            )}

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

        {/* Trust Badges */}
        <TrustBadges />
      </div>

      <Footer />
    </div>
  )
}
