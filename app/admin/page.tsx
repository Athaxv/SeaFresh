"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { EmptyState } from "@/components/empty-state"
import { formatPrice } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Package, ShoppingCart, Users, Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react"

const CHART_COLORS = ["#003B73", "#00A6A6", "#FF6B6B", "#FFB84D", "#6C5CE7"]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0
  })
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
  }, [])

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Fetch products when products tab is active
  useEffect(() => {
    if (activeTab === "products") {
      const fetchProducts = async () => {
        setLoadingProducts(true)
        try {
          const response = await fetch("/api/products")
          const data = await response.json()
          setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Failed to fetch products:", error)
        } finally {
          setLoadingProducts(false)
        }
      }
      fetchProducts()
    }
  }, [activeTab])

  // Fetch customers when customers tab is active
  useEffect(() => {
    if (activeTab === "customers") {
      const fetchCustomers = async () => {
        setLoadingCustomers(true)
        try {
          const response = await fetch("/api/admin/customers")
          const data = await response.json()
          setCustomers(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Failed to fetch customers:", error)
        } finally {
          setLoadingCustomers(false)
        }
      }
      fetchCustomers()
    }
  }, [activeTab])

  const statsArray = [
    { label: "Total Orders", value: stats.totalOrders, change: "+12%", icon: ShoppingCart },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), change: "+8%", icon: TrendingUp },
    { label: "Active Products", value: stats.totalProducts, change: "+3", icon: Package },
    { label: "Total Customers", value: stats.totalCustomers, change: "+45", icon: Users },
  ]

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  // Mock data for charts (can be replaced with real analytics data later)
  const salesData = [
    { date: "Mon", sales: 4000, orders: 24 },
    { date: "Tue", sales: 3000, orders: 13 },
    { date: "Wed", sales: 2000, orders: 9 },
    { date: "Thu", sales: 2780, orders: 39 },
    { date: "Fri", sales: 1890, orders: 22 },
    { date: "Sat", sales: 2390, orders: 22 },
    { date: "Sun", sales: 3490, orders: 20 },
  ]

  const categoryData = [
    { name: "Fish", value: 35 },
    { name: "Prawns", value: 28 },
    { name: "Squid", value: 18 },
    { name: "Crabs", value: 12 },
    { name: "Others", value: 7 },
  ]



  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "processing":
        return "bg-blue-100 text-blue-700"
      case "shipped":
        return "bg-purple-100 text-purple-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your seafood business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-6 border-0">
                    <Skeleton className="h-12 w-12 mb-4" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsArray.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <Card key={idx} className="p-6 border-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Sales Chart */}
              <Card className="p-6 border-0 lg:col-span-2">
                <h3 className="text-lg font-bold text-foreground mb-6">Sales & Orders</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="var(--color-primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="var(--color-secondary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Category Distribution */}
              <Card className="p-6 border-0">
                <h3 className="text-lg font-bold text-foreground mb-6">Category Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }: { name: string; value: number }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6 border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Recent Orders</h3>
                {orders.length > 0 && (
                  <Link href="/admin/orders">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      View All
                    </Button>
                  </Link>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <EmptyState
                  icon="package"
                  title="No Orders Yet"
                  description="Orders will appear here once customers start placing them."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Order #</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <>
                          <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition">
                            <td className="py-3 px-4 font-semibold text-foreground">{order.orderNumber || order.id}</td>
                            <td className="py-3 px-4 text-foreground">
                              {order.user?.name || order.user?.username || 'N/A'}
                            </td>
                            <td className="py-3 px-4 font-semibold text-foreground">
                              {formatPrice(order.totalAmount)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.orderStatus.toLowerCase())}`}
                              >
                                {order.orderStatus.toLowerCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => toggleOrderDetails(order.id)}
                              >
                                {expandedOrderId === order.id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                          {expandedOrderId === order.id && (
                            <tr>
                              <td colSpan={6} className="bg-muted/30 p-4">
                                <div className="space-y-3">
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Order Items:
                                  </h4>
                                  {Array.isArray(order.products) && order.products.length > 0 ? (
                                    order.products.map((product: any, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between py-2 border-b border-border">
                                        <div className="flex-1">
                                          <p className="font-medium">{product.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            Seller: {product.sellerInfo?.companyName || product.sellerInfo?.username || 'N/A'}
                                          </p>
                                          <p className="text-xs text-muted-foreground">{product.weight} • {product.category}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium">{formatPrice(product.price)} × {product.quantity}</p>
                                          <p className="text-sm text-muted-foreground">
                                            Total: {formatPrice(product.price * product.quantity)}
                                          </p>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No product details available</p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Product Management</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            <Card className="p-6 border-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Sales</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-semibold text-foreground">{product.name}</td>
                        <td className="py-3 px-4 text-foreground capitalize">{product.category}</td>
                        <td className="py-3 px-4 font-semibold text-foreground">{formatPrice(product.price)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 20 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground">-</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Order Management</h2>

            <Card className="p-6 border-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-semibold text-foreground">{order.orderNumber || order.id}</td>
                        <td className="py-3 px-4 text-foreground">
                          {order.user?.name || order.user?.username || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <select className="px-3 py-1 rounded-lg border border-border text-xs font-semibold bg-background" defaultValue={order.orderStatus.toLowerCase()}>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Customer Management</h2>

            <Card className="p-6 border-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Orders</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCustomers ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-semibold text-foreground">{customer.name || customer.username || 'N/A'}</td>
                        <td className="py-3 px-4 text-foreground">{customer.email}</td>
                        <td className="py-3 px-4 text-foreground">{customer.phone || 'N/A'}</td>
                        <td className="py-3 px-4 text-foreground">{customer.orderCount || 0}</td>
                        <td className="py-3 px-4 font-semibold text-foreground">{formatPrice(customer.totalSpent || 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "products", label: "Products" },
            { id: "orders", label: "Orders" },
            { id: "customers", label: "Customers" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
