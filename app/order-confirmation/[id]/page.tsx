"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Package, Truck, MapPin } from "lucide-react"

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    date: new Date().toLocaleDateString(),
    total: "₹1,485",
    items: 3,
    address: "123 Main St, Mumbai, 400001",
    deliveryDate: "Tomorrow, 3:00 PM - 6:00 PM",
    trackingNumber: `TRK${Date.now()}`,
  }

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
                <p className="text-2xl font-bold text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="text-2xl font-bold text-foreground">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary">{order.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Items</p>
                <p className="text-2xl font-bold text-foreground">{order.items} items</p>
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
                <p className="text-muted-foreground mb-3">{order.address}</p>
                <p className="text-sm font-semibold text-foreground">Expected Delivery: {order.deliveryDate}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/track-order" className="flex-1">
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
