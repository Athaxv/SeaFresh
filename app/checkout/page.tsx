"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatPrice, calculateTax } from "@/lib/utils"
import { ArrowLeft, Check } from "lucide-react"

const DELIVERY_SLOTS = ["9:00 AM - 12:00 PM", "12:00 PM - 3:00 PM", "3:00 PM - 6:00 PM", "6:00 PM - 9:00 PM"]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: "",
    deliverySlot: "",
    paymentMethod: "cod",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      alert("Please fill in all required fields")
      return
    }

    // Create order
    const order = {
      id: `ORD${Date.now()}`,
      items,
      address: formData,
      total,
      paymentMethod: formData.paymentMethod,
      status: "pending",
      createdAt: new Date(),
    }

    // Save order and redirect
    localStorage.setItem("lastOrder", JSON.stringify(order))
    clearCart()
    router.push(`/order-confirmation/${order.id}`)
  }

  // Calculate totals
  const subtotal = items.reduce((sum) => sum + 450, 0) // Mock calculation
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

                  <Button size="lg" className="w-full" onClick={() => setStep(2)}>
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
                    <label className="block text-sm font-semibold text-foreground mb-2">Delivery Date</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Delivery Slot</label>
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

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button size="lg" className="flex-1" onClick={() => setStep(3)}>
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
                  <Button size="lg" className="flex-1" onClick={handlePlaceOrder}>
                    Place Order
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
    </div>
  )
}
