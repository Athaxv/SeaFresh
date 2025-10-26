"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Package, Truck, MapPin, CheckCircle, Clock } from "lucide-react"

export default function TrackOrderPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    date: "2025-01-15",
    total: "₹1,485",
    items: [
      { name: "Medium Prawns - Cleaned", qty: 1, price: "₹450" },
      { name: "Rohu Fish - Bengali Cut", qty: 1, price: "₹247" },
      { name: "Squid - Cleaned", qty: 1, price: "₹320" },
    ],
    address: "123 Main St, Mumbai, 400001",
    phone: "+91 9876543210",
    timeline: [
      {
        status: "Order Placed",
        date: "Jan 15, 10:30 AM",
        description: "Your order has been confirmed",
        completed: true,
      },
      {
        status: "Processing",
        date: "Jan 15, 11:00 AM",
        description: "We're preparing your fresh seafood",
        completed: true,
      },
      {
        status: "Out for Delivery",
        date: "Jan 15, 2:00 PM",
        description: "Your order is on the way",
        completed: true,
      },
      {
        status: "Delivered",
        date: "Jan 15, 4:30 PM",
        description: "Order delivered successfully",
        completed: true,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Track Order {order.id}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-900">Order Delivered</h2>
                  <p className="text-green-700">Your order was delivered on Jan 15 at 4:30 PM</p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 border-0">
              <h3 className="text-xl font-bold text-foreground mb-6">Delivery Timeline</h3>
              <div className="space-y-6">
                {order.timeline.map((event, idx) => {
                  const isLast = idx === order.timeline.length - 1
                  let Icon = Clock
                  if (event.status === "Order Placed") Icon = Package
                  if (event.status === "Out for Delivery") Icon = Truck
                  if (event.status === "Delivered") Icon = CheckCircle

                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && <div className={`w-1 h-12 ${event.completed ? "bg-green-200" : "bg-muted"}`} />}
                      </div>
                      <div className="pb-6">
                        <h4 className="font-bold text-foreground">{event.status}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                        <p className="text-sm text-foreground">{event.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Items */}
            <Card className="p-6 border-0">
              <h3 className="font-bold text-foreground mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name}</span>
                    <span className="font-semibold text-foreground">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6 border-0">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h3>
              <p className="text-sm text-foreground mb-3">{order.address}</p>
              <p className="text-sm text-muted-foreground">{order.phone}</p>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full">Download Invoice</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
