import prisma from "../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production"

function getUserIdFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }
  
  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string }
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

