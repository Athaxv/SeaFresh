import prisma from "../../../../../lib/db2"
import { validateEmail } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const seller = await prisma.seller.findFirst({
      where: {
        email: email,
        password: password
      }
    })
    
    if (!seller) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 404 })
    }

    const token = jwt.sign(
      { 
        userId: seller.id, 
        email: seller.email, 
        role: "SELLER" 
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: seller.id,
        email: seller.email,
        username: seller.username,
        name: seller.username,
        companyName: seller.companyName,
        role: seller.role,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

