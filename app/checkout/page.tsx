"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressDialog } from "@/components/address-dialog"
import { useCart } from "@/lib/cart-context"
import { formatPrice, calculateTax } from "@/lib/utils"
import { getAuthToken } from "@/lib/auth-client"
import { toast } from "sonner"
import { ArrowLeft, Check, MapPin } from "lucide-react"

const DELIVERY_SLOTS = ["9:00 AM - 12:00 PM", "12:00 PM - 3:00 PM", "3:00 PM - 6:00 PM", "6:00 PM - 9:00 PM"]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    deliverySlot: "",
    paymentMethod: "cod",
  })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          setLoading(false)
          return
        }
        
        const response = await fetch("/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setSavedAddresses(data.addresses || [])
      } catch (error) {
        console.error("Error fetching addresses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const handleAddressSelect = (address: any) => {
    setSelectedAddressId(address.id)
    setFormData(prev => ({
      ...prev,
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    }))
  }

  const handleAddressAdded = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch("/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      const addresses = data.addresses || []
      setSavedAddresses(addresses)
      
      // Auto-select the newly added address (last one)
      if (addresses.length > 0) {
        const newAddress = addresses[addresses.length - 1]
        handleAddressSelect(newAddress)
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.deliverySlot) {
      toast.error("Please select a delivery slot")
      return
    }

    setIsPlacingOrder(true)

    try {
      const token = getAuthToken()
      if (!token) {
        toast.error("Please login to place an order")
        router.push("/login")
        return
      }

      // Step 1: Fetch product details for cart items
      const productIds = items.map(item => item.productId)
      const productsResponse = await fetch("/api/products")
      const allProducts = await productsResponse.json()
      const products = allProducts.filter((p: any) => productIds.includes(p.id))

      // Step 2: Create order products array with proper structure
      const orderProducts = items.map(item => {
        const product = products.find((p: any) => p.id === item.productId)
        return {
          productId: item.productId,
          quantity: item.quantity,
          sellerId: product?.sellerId || null,
          price: product?.price || 0
        }
      })

      // Step 3: Calculate totals based on actual product prices
      const subtotal = orderProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const tax = calculateTax(subtotal)
      const totalAmount = subtotal + tax

      // Step 4: Handle address - use existing ID or create new one
      let addressId = selectedAddressId

      if (!addressId) {
        // Create new address
        const addressResponse = await fetch("/api/customer/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          })
        })
        
        if (!addressResponse.ok) {
          throw new Error("Failed to create address")
        }
        
        const addressData = await addressResponse.json()
        addressId = addressData.id
      }

      // Step 5: Create the order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          addressId,
          products: orderProducts,
          subtotal,
          tax,
          discount: 0,
          totalAmount,
          paymentMethod: formData.paymentMethod.toUpperCase()
        })
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      toast.success("Order placed successfully!")
      clearCart()
      router.push(`/order-confirmation/${orderData.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  // Calculate totals (mock calculation for display only)
  const subtotal = items.reduce((sum) => sum + 450, 0)
  const tax = calculateTax(subtotal)
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/cart" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">
                    {s === 1 ? "Address" : s === 2 ? "Delivery" : "Payment"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
              <Card className="p-6 border-0">
                <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Address</h2>
                <div className="space-y-4">
                  {/* Saved Addresses Selection */}
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : savedAddresses.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Select a saved address or add a new one:</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {savedAddresses.map((addr) => (
                          <Card
                            key={addr.id}
                            className={`p-4 cursor-pointer border-2 transition ${
                              selectedAddressId === addr.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => handleAddressSelect(addr)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <h3 className="font-bold text-foreground">{addr.name}</h3>
                                  {selectedAddressId === addr.id && (
                                    <Check className="w-4 h-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {addr.street}, {addr.city}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {addr.state} - {addr.pincode}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {addr.phone}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedAddressId("")
                      setIsAddressDialogOpen(true)
                    }}
                  >
                    + Add New Address
                  </Button>

                  {/* Manual Address Entry */}
                  {!selectedAddressId && (
                    <div className="space-y-4 mt-6 pt-6 border-t border-border">
                      <p className="text-sm font-semibold text-foreground">Or enter address manually:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          name="pincode"
                          placeholder="PIN Code"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={() => setStep(2)}
                    disabled={!selectedAddressId && !formData.street}
                  >
                    Continue to Delivery
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <Card className="p-6 border-0">
                <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Select Delivery Slot</label>
                    <div className="grid grid-cols-2 gap-3">
                      {DELIVERY_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setFormData((prev) => ({ ...prev, deliverySlot: slot }))}
                          className={`p-3 rounded-lg border-2 transition ${
                            formData.deliverySlot === slot
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> The exact delivery date will be confirmed by the seller after your order is placed.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button 
                      size="lg" 
                      className="flex-1" 
                      onClick={() => setStep(3)}
                      disabled={!formData.deliverySlot}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card className="p-6 border-0">
                <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: "💵" },
                    { id: "upi", label: "UPI", icon: "📱" },
                    { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method.id }))}
                      className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition ${
                        formData.paymentMethod === method.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-semibold text-foreground">{method.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1" 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="p-6 border-0 sticky top-20">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{items.length} items</span>
                  <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </Card>
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
