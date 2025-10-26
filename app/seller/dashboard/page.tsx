"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus, Eye, Edit } from "lucide-react"

interface SellerData {
  id: string
  email: string
  username: string
  companyName: string
  name?: string
  role: string
}

interface Stats {
  totalProducts: number
  activeProducts: number
  outOfStock: number
  totalOrders: number
  revenue: number
}

export default function SellerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<SellerData | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalOrders: 0,
    revenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Check if user is a seller
      if (parsedUser.role !== "SELLER") {
        router.push("/")
      }
    } else {
      router.push("/seller/login")
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      
      // Fetch stats
      const statsRes = await fetch("/api/seller/dashboard/stats", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch recent orders
      const ordersRes = await fetch("/api/seller/orders?limit=5", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      const ordersData = await ordersRes.json()
      setRecentOrders(ordersData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.companyName || user?.username || "Seller"}!
            </h1>
            <p className="text-muted-foreground mt-2">Manage your products and orders</p>
          </div>
          <Link href="/seller/products/add">
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
              </div>
              <Package className="h-12 w-12 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-3xl font-bold mt-2">{stats.activeProducts}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/seller/products">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/seller/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">In Stock</span>
                <span className="font-semibold">{stats.activeProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Out of Stock</span>
                <span className="font-semibold text-red-500">{stats.outOfStock}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/seller/orders">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted">
                  <div>
                    <p className="font-semibold">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">₹{order.totalAmount}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {order.orderStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  )
}

