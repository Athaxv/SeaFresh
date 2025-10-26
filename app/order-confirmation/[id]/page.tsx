"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Package, Truck, MapPin } from "lucide-react"
import { getAuthToken } from "@/lib/auth-client"
import { formatPrice } from "@/lib/utils"

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  createdAt: string
  address: {
    name: string
    street: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  products: any[]
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          console.error("No auth token")
          return
        }

        const response = await fetch(`/api/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="space-y-6 mb-12">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Order Not Found</h1>
            <p className="text-lg text-muted-foreground mb-6">We couldn't find this order.</p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const productsArray = Array.isArray(order.products) ? order.products : []
  const itemsCount = productsArray.reduce((sum, item: any) => sum + (item.quantity || 1), 0)
  const address = order.address

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your order. Your fresh seafood is on the way!</p>
        </div>

        {/* Order Details */}
        <div className="space-y-6 mb-12">
          {/* Order Number */}
          <Card className="p-6 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="text-2xl font-bold text-foreground">{order.orderNumber || order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="text-2xl font-bold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Items</p>
                <p className="text-2xl font-bold text-foreground">{itemsCount} item{itemsCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </Card>

          {/* Delivery Timeline */}
          <Card className="p-6 border-0">
            <h3 className="text-lg font-bold text-foreground mb-6">Delivery Timeline</h3>
            <div className="space-y-4">
              {[
                { icon: Package, label: "Order Placed", status: "completed" },
                { icon: Package, label: "Processing", status: "in-progress" },
                { icon: Truck, label: "Out for Delivery", status: "pending" },
                { icon: CheckCircle, label: "Delivered", status: "pending" },
              ].map((step, idx) => {
                const Icon = step.icon
                return (
                  <div key={idx} className="flex gap-4 items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : step.status === "in-progress"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{step.label}</p>
                      {step.status === "in-progress" && (
                        <p className="text-sm text-muted-foreground">Currently processing your order</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="p-6 border-0">
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-foreground mb-2">Delivery Address</h4>
                <p className="text-muted-foreground mb-1">{address.name} - {address.phone}</p>
                <p className="text-muted-foreground mb-1">{address.street}</p>
                <p className="text-muted-foreground mb-3">{address.city}, {address.state} - {address.pincode}</p>
                <p className="text-sm font-semibold text-foreground">Delivery date will be confirmed by the seller</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/track-order/${order.id}`} className="flex-1">
            <Button size="lg" className="w-full">
              Track Order
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button size="lg" variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
