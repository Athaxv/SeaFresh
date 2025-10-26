// Authentication utilities and session management
import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function createToken(payload: any, expiresIn = "7d") {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret)
  return token
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export function setAuthCookie(token: string) {
  // This would be handled by middleware in production
  if (typeof document !== "undefined") {
    document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Strict`
  }
}

export function getAuthCookie() {
  if (typeof document !== "undefined") {
    const name = "auth_token="
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(";")
    for (let cookie of cookieArray) {
      cookie = cookie.trim()
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length)
      }
    }
  }
  return null
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "auth_token=; path=/; max-age=0"
  }
}
