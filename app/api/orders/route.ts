import prisma from "../../../lib/db2"
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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { addressId, products, subtotal, tax, discount, totalAmount, paymentMethod } = body

    // Generate order number
    const orderNumber = `ORD${Date.now()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        subtotal,
        tax,
        discount,
        totalAmount,
        products: products,
        paymentMethod: paymentMethod || "COD",
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
        orderStatus: "PENDING"
      },
      include: {
        user: true,
        address: true
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}



