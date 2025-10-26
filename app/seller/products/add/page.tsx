"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

const CATEGORIES = ["FISH", "PRAWN", "CRAB", "LOBSTER", "SQUID", "COMBO"]
const CUT_OPTIONS = ["whole", "cleaned", "bengali", "fillet", "steaks", "rings", "pieces", "mixed"]

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "FISH",
    price: "",
    weight: "500g",
    image: "",
    images: [] as string[],
    cut: "",
    stock: "0",
    origin: "",
    rating: "3",
    isFeatured: false,
    nutrition: {
      protein: "",
      fat: "",
      carbs: "",
      calories: "",
      omega3: ""
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          rating: parseFloat(formData.rating)
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/seller/products")
      } else {
        alert(data.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Failed to create product:", error)
      alert("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Weight</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-semibold mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Nutrition Facts */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Protein</label>
                  <input
                    type="text"
                    value={formData.nutrition.protein}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      nutrition: { ...formData.nutrition, protein: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Fat</label>
                  <input
                    type="text"
                    value={formData.nutrition.fat}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      nutrition: { ...formData.nutrition, fat: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Carbs</label>
                  <input
                    type="text"
                    value={formData.nutrition.carbs}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      nutrition: { ...formData.nutrition, carbs: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Calories</label>
                  <input
                    type="text"
                    value={formData.nutrition.calories}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      nutrition: { ...formData.nutrition, calories: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Omega-3</label>
                  <input
                    type="text"
                    value={formData.nutrition.omega3}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      nutrition: { ...formData.nutrition, omega3: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-secondary" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

