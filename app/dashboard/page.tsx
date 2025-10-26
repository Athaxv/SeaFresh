"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { User, Package, Heart, Bell, LogOut, Edit2, MapPin } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("orders")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    addresses: [
      {
        id: 1,
        name: "Home",
        address: "123 Main St, Mumbai, 400001",
        isDefault: true,
      },
      {
        id: 2,
        name: "Office",
        address: "456 Business Park, Mumbai, 400002",
        isDefault: false,
      },
    ],
  })

  const orders = [
    {
      id: "ORD001",
      date: "2025-01-15",
      items: 3,
      total: "₹1,485",
      status: "delivered",
      products: ["Medium Prawns", "Rohu Fish", "Squid"],
    },
    {
      id: "ORD002",
      date: "2025-01-10",
      items: 2,
      total: "₹890",
      status: "delivered",
      products: ["Mackerel Fish", "Small Prawns"],
    },
    {
      id: "ORD003",
      date: "2025-01-05",
      items: 4,
      total: "₹2,150",
      status: "delivered",
      products: ["Catla Fish", "Medium Prawns", "Squid", "Crab"],
    },
  ]

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
                <h3 className="font-bold text-foreground">{profile.name}</h3>
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

              <Button variant="outline" className="w-full mt-6 bg-transparent gap-2">
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

                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6 border-0 hover:shadow-lg transition">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mb-4 pb-4 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-2">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.products.map((product, idx) => (
                            <span key={idx} className="text-xs bg-muted px-3 py-1 rounded-full">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">{order.total}</span>
                        <div className="flex gap-2">
                          <Link href={`/track-order/${order.id}`}>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Track
                            </Button>
                          </Link>
                          <Button size="sm">Reorder</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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
                          <Button size="sm">Add to Cart</Button>
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
                        value={profile.name}
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-muted"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-muted"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
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
                  <div className="space-y-4">
                    {profile.addresses.map((addr) => (
                      <div key={addr.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <h4 className="font-bold text-foreground">{addr.name}</h4>
                          </div>
                          {addr.isDefault && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.address}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent">
                      Add New Address
                    </Button>
                  </div>
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
    </div>
  )
}
