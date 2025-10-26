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

    const admin = await prisma.admin.findFirst({
      where: {
        email: email,
        password: password
      }
    })
    
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 404 })
    }

    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email, 
        role: "ADMIN" 
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}


