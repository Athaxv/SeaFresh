// Core TypeScript types for the application
export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: "customer" | "admin"
  addresses: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  category: "fish" | "prawn" | "crab" | "lobster" | "squid" | "combo"
  price: number
  weight: string
  cut: "whole" | "fillet" | "cleaned"
  image: string
  images: string[]
  stock: number
  rating: number
  reviews: Review[]
  nutrition: NutritionFacts
  origin: string
  tags: string[]
  discount?: number
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface NutritionFacts {
  protein: string
  fat: string
  carbs: string
  calories: string
  omega3: string
}

export interface CartItem {
  productId: string
  quantity: number
  weight: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  address: Address
  totalAmount: number
  subtotal: number
  tax: number
  discount: number
  paymentMethod: "upi" | "card" | "cod"
  paymentStatus: "pending" | "completed" | "failed"
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  deliveryDate: Date
  deliverySlot: string
  trackingNumber: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  weight: string
  price: number
  image: string
}

export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: "percentage" | "fixed"
  maxUses: number
  usedCount: number
  expiryDate: Date
  minOrderAmount: number
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  isActive: boolean
  displayOrder: number
}
