import prisma from "../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function getUserIdFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) return null
    
    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, SECRET_KEY) as any
    return decoded.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all orders that contain products from this seller
    const sellerProducts = await prisma.product.findMany({
      where: { sellerId: userId }
    })

    const productIds = sellerProducts.map(p => p.id)

    // Get all orders
    const allOrders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true
          }
        },
        address: true
      }
    })

    // Filter orders that contain seller's products
    const sellerOrders = allOrders.filter(order => {
      if (!order.products || typeof order.products !== 'object') return false
      const orderProducts = order.products as any[]
      return Array.isArray(orderProducts) && orderProducts.some((item: any) => 
        productIds.includes(item.productId)
      )
    })

    const limit = request.nextUrl.searchParams.get("limit")
    const limitedOrders = limit ? sellerOrders.slice(0, parseInt(limit)) : sellerOrders

    return NextResponse.json(limitedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}


