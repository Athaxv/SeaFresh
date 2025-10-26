import prisma from "../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function getUserIdFromToken(request: NextRequest): string | null {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "")
      const decoded = jwt.verify(token, SECRET_KEY) as any
      return decoded.userId || decoded.sellerId
    }
    
    return null
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      include: {
        nutrition: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      console.error("No user ID found in token")
      return NextResponse.json({ error: "Unauthorized. Please login again." }, { status: 401 })
    }

    const data = await request.json()
    const { name, description, category, price, weight, image, images, cut, stock, origin, rating, isFeatured, nutrition } = data

    // Validate required fields
    if (!name || !description || !category || !price || !weight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category: category.toUpperCase(), // Ensure enum format
        price: parseFloat(price),
        weight,
        image: image || "",
        images: images || [],
        cut,
        stock: parseInt(stock) || 0,
        origin,
        rating: parseFloat(rating) || 3,
        isFeatured: isFeatured || false,
        sellerId: userId,
        nutrition: nutrition ? {
          create: {
            protein: nutrition.protein || "",
            fat: nutrition.fat || "",
            carbs: nutrition.carbs || "",
            calories: nutrition.calories || "",
            omega3: nutrition.omega3 || ""
          }
        } : undefined
      },
      include: {
        nutrition: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    
    // Provide better error messages
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Product already exists" }, { status: 409 })
    }
    
    return NextResponse.json({ 
      error: "Failed to create product", 
      details: error.message 
    }, { status: 500 })
  }
}

