import prisma from "../../../../../lib/db2"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function getUserIdFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) return null
    
    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, SECRET_KEY) as any
    return decoded.userId
  } catch {
    return null
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}


