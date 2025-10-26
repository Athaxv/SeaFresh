import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload
    return decoded
  } catch {
    return null
  }
}

export function getUserFromToken(token: string): TokenPayload | null {
  return verifyToken(token)
}

export function requireAuth(request: Request): TokenPayload | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.replace("Bearer ", "")
  return getUserFromToken(token)
}


