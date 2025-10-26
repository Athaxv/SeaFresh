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
    return decoded.userId || decoded.email
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phone, street, city, state, pincode } = await request.json()

    // Validation
    if (!name || !phone || !street || !city || !state || !pincode) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Find user by ID or email
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: userId } })
    }
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        phone,
        street,
        city,
        state,
        pincode
      }
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}


