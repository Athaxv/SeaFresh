"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingBag, Package, Calendar } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
  user: {
    email: string
    name: string | null
  }
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/seller/orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">Orders containing your products will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      Customer: {order.user.name || order.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{order.totalAmount}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Payment: {order.paymentStatus}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}


