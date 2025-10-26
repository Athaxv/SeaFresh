import prisma from "../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const query = searchParams.get("q")

    let products

    if (category) {
      products = await prisma.product.findMany({
        where: {
          category: category as any
        },
        include: {
          nutrition: true,
          seller: {
            select: {
              id: true,
              companyName: true,
              username: true
            }
          }
        }
      })
    } else if (query) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          nutrition: true,
          seller: {
            select: {
              id: true,
              companyName: true,
              username: true
            }
          }
        }
      })
    } else {
      products = await prisma.product.findMany({
        include: {
          nutrition: true,
          seller: {
            select: {
              id: true,
              companyName: true,
              username: true
            }
          }
        }
      })
    }

    return NextResponse.json(products || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json([], { status: 500 })
  }
}
