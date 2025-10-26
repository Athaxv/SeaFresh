import prisma from "../../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get all orders
    const allOrders = await prisma.order.findMany()
    
    // Calculate revenue (total of all orders)
    const revenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    
    // Get total users (customers)
    const totalCustomers = await prisma.user.count()
    
    // Get total products
    const totalProducts = await prisma.product.count()
    
    // Get recent orders count (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const stats = {
      totalOrders: allOrders.length,
      totalRevenue: revenue,
      totalProducts,
      totalCustomers,
      recentOrders
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}


