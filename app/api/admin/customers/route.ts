import prisma from "../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get all users who have at least one order
    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            totalAmount: true
          }
        }
      }
    })

    // Filter users with orders and calculate statistics
    const customers = users
      .filter(user => user.orders.length > 0)
      .map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        orderCount: user.orders.length,
        totalSpent: user.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
