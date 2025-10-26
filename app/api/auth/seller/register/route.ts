import prisma from "../../../../../lib/db2"
import { validateEmail, validatePhone } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { email, phone, username, password, companyName } = await request.json()

    // Validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    // Check if seller exists
    const existingSeller = await prisma.seller.findUnique({
      where: {
        email: email
      }
    })
    
    if (existingSeller) {
      return NextResponse.json({ error: "Seller already exists" }, { status: 409 })
    }

    // Create seller
    const seller = await prisma.seller.create({
      data: {
        email,
        username,
        password,
        phone,
        companyName,
        role: "SELLER"
      }
    })

    console.log('Seller created:', seller)

    return NextResponse.json(
      {
        success: true,
        message: "Seller account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

