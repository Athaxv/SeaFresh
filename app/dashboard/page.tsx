"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AddressDialog } from "@/components/address-dialog"
import { User, Package, Heart, Bell, LogOut, Edit2, MapPin } from "lucide-react"
import { getAuthToken, logout as authLogout } from "@/lib/auth-client"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

export default function DashboardPage() {
  const router = useRouter()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("orders")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [reorderingId, setReorderingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch profile
        const profileRes = await fetch("/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profileData = await profileRes.json()
        setProfile(profileData)
        setAddresses(profileData.addresses || [])

        // Fetch orders
        const ordersRes = await fetch("/api/customer/orders", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!ordersRes.ok) throw new Error("Failed to fetch orders")
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleAddressAdded = async () => {
    try {
      const token = getAuthToken()
      const res = await fetch("/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error("Error fetching addresses:", error)
    }
  }

  const handleReorder = async (order: any) => {
    try {
      setReorderingId(order.id)
      const token = getAuthToken()
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          addressId: order.addressId,
          products: order.products,
          subtotal: order.subtotal,
          tax: order.tax,
          discount: order.discount || 0,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod || "COD"
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const newOrder = await response.json()
      toast.success("Order placed successfully!")
      router.push(`/order-confirmation/${newOrder.id}`)
    } catch (error) {
      console.error("Error reordering:", error)
      toast.error("Failed to reorder. Please try again.")
    } finally {
      setReorderingId(null)
    }
  }

  const handleFavoriteAddToCart = (item: any) => {
    addItem(item, 1)
    toast.success("Added to cart!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            <Card className="p-6 border-0">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto mt-2" />
            </Card>
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) return null

  const favorites = [
    {
      id: "1",
      name: "Medium Prawns - Cleaned",
      price: "₹450",
      image: "/fresh-medium-prawns-on-wooden-board.jpg",
    },
    {
      id: "2",
      name: "Rohu Fish - Bengali Cut",
      price: "₹247",
      image: "/fresh-rohu-fish-bengali-cut.jpg",
    },
    {
      id: "3",
      name: "Mackerel - Whole",
      price: "₹448",
      image: "/fresh-mackerel-fish-whole-cleaned.jpg",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "processing":
        return "bg-blue-100 text-blue-700"
      case "shipped":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 sticky top-20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-foreground">{profile.name || profile.username || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "orders", label: "My Orders", icon: Package },
                  { id: "favorites", label: "Favorites", icon: Heart },
                  { id: "profile", label: "Profile", icon: User },
                  { id: "notifications", label: "Notifications", icon: Bell },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              <Button 
                variant="outline" 
                className="w-full mt-6 bg-transparent gap-2"
                onClick={authLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">My Orders</h2>
                  <p className="text-muted-foreground">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                  <EmptyState
                    icon="package"
                    title="No Orders Yet"
                    description="You haven't placed any orders yet. Start shopping to see your orders here!"
                    ctaLabel="Start Shopping"
                    ctaHref="/shop"
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const productsArray = Array.isArray(order.products) ? order.products : []
                      return (
                        <Card key={order.id} className="p-6 border-0 hover:shadow-lg transition">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-bold text-foreground mb-1">{order.orderNumber || order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                                order.orderStatus.toLowerCase(),
                              )}`}
                            >
                              {order.orderStatus.toLowerCase()}
                            </span>
                          </div>

                          <div className="mb-4 pb-4 border-b border-border">
                            <p className="text-sm text-muted-foreground mb-2">
                              Items ({productsArray.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {productsArray.slice(0, 5).map((product: any, idx: number) => (
                                <span key={idx} className="text-xs bg-muted px-3 py-1 rounded-full">
                                  {product.name}
                                </span>
                              ))}
                              {productsArray.length > 5 && (
                                <span className="text-xs bg-muted px-3 py-1 rounded-full">
                                  +{productsArray.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-foreground">
                              {formatPrice(order.totalAmount)}
                            </span>
                            <div className="flex gap-2">
                              <Link href={`/track-order/${order.id}`}>
                                <Button size="sm" variant="outline" className="bg-transparent">
                                  Track
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                onClick={() => handleReorder(order)}
                                disabled={reorderingId === order.id}
                              >
                                {reorderingId === order.id ? "Processing..." : "Reorder"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">My Favorites</h2>
                  <p className="text-muted-foreground">Your saved seafood items</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item) => (
                    <Card key={item.id} className="border-0 overflow-hidden hover:shadow-lg transition">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{item.price}</span>
                          <Button size="sm" onClick={() => handleFavoriteAddToCart(item)}>Add to Cart</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h2>
                  <p className="text-muted-foreground">Manage your account information</p>
                </div>

                {/* Personal Info */}
                <Card className="p-6 border-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent gap-2"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      <Edit2 className="w-4 h-4" />
                      {isEditingProfile ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name || profile.username || ''}
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-muted"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email || ''}
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-muted"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-muted"
                      />
                    </div>
                    {isEditingProfile && <Button className="w-full">Save Changes</Button>}
                  </div>
                </Card>

                {/* Addresses */}
                <Card className="p-6 border-0">
                  <h3 className="text-xl font-bold text-foreground mb-6">Saved Addresses</h3>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No saved addresses</p>
                      <Button 
                        variant="outline" 
                        className="bg-transparent"
                        onClick={() => setIsAddressDialogOpen(true)}
                      >
                        Add New Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr: any) => (
                        <div key={addr.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <h4 className="font-bold text-foreground">{addr.name}</h4>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full bg-transparent"
                        onClick={() => setIsAddressDialogOpen(true)}
                      >
                        Add New Address
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Notifications</h2>
                  <p className="text-muted-foreground">Stay updated with your orders and offers</p>
                </div>

                <Card className="p-6 border-0">
                  <div className="space-y-4">
                    {[
                      {
                        title: "Order Delivered",
                        message: "Your order ORD001 has been delivered successfully",
                        time: "2 hours ago",
                        read: true,
                      },
                      {
                        title: "Special Offer",
                        message: "Get 20% off on prawns this weekend!",
                        time: "1 day ago",
                        read: false,
                      },
                      {
                        title: "Order Shipped",
                        message: "Your order ORD002 is on the way",
                        time: "3 days ago",
                        read: true,
                      },
                    ].map((notif, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          notif.read ? "bg-background border-border" : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-foreground">{notif.title}</h4>
                          <span className="text-xs text-muted-foreground">{notif.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />

      {/* Address Dialog */}
      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  )
}
