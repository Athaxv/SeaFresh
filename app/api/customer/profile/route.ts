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
    const decoded = jwt.verify(token, SECRET_KEY) as any
    // Handle both userId and email fields
    return decoded.userId || decoded.email
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to find user by ID first, then by email if ID doesn't work
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        addresses: true
      }
    })

    // If not found by ID, try by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: userId },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          addresses: true
        }
      })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

