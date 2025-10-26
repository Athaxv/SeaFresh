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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Verify user owns this order
    if (order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}


