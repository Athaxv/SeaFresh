import { getAllProducts, getProductsByCategory, searchProducts, initializeDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

let initialized = false

export async function GET(request: NextRequest) {
  try {
    // Initialize database once
    if (!initialized) {
      initializeDatabase()
      initialized = true
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const query = searchParams.get("q")

    let products

    if (query) {
      products = await searchProducts(query)
    } else if (category) {
      products = await getProductsByCategory(category)
    } else {
      products = await getAllProducts()
    }

    return NextResponse.json(products || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json([], { status: 500 })
  }
}
