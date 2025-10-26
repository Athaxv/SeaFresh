import prisma from "../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            phone: true
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Enrich orders with seller information
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const productsArray = Array.isArray(order.products) ? order.products : []
        
        // Extract unique seller IDs from products
        const sellerIds = [...new Set(
          productsArray
            .map((p: any) => p.sellerId)
            .filter(Boolean)
        )]
        
        // Fetch seller info if there are any sellers
        let sellerMap: Record<string, any> = {}
        if (sellerIds.length > 0) {
          const sellers = await prisma.seller.findMany({
            where: { id: { in: sellerIds } },
            select: { id: true, companyName: true, username: true }
          })
          
          // Create seller lookup map
          sellerMap = sellers.reduce((acc: any, seller) => {
            acc[seller.id] = seller
            return acc
          }, {})
        }
        
        // Add seller info to each product
        const productsWithSeller = productsArray.map((product: any) => ({
          ...product,
          sellerInfo: product.sellerId ? sellerMap[product.sellerId] : null
        }))
        
        return {
          ...order,
          products: productsWithSeller
        }
      })
    )

    return NextResponse.json(enrichedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

