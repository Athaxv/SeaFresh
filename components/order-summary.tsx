"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import React from "react"

interface OrderSummaryProps {
  showCheckoutButton?: boolean
}

export function OrderSummary({ showCheckoutButton = true }: OrderSummaryProps) {
  const { getCartItemsWithProduct, total } = useCart()
  const [products, setProducts] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }
    fetchProducts()
  }, [])

  const cartItems = getCartItemsWithProduct(products)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const delivery = subtotal > 0 ? 50 : 0
  const tax = subtotal * 0.18 // 18% GST
  const totalAmount = subtotal + delivery + tax

  return (
    <Card className="p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({total} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">{formatPrice(delivery)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(totalAmount)}</span>
        </div>
      </div>
      {showCheckoutButton && (
        <Link href="/checkout" className="block">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      )}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Secure checkout • Free delivery on orders above ₹500
      </p>
    </Card>
  )
}

