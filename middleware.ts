import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow public access to auth pages
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname === "/seller/login" ||
    request.nextUrl.pathname === "/seller/register" ||
    request.nextUrl.pathname === "/admin/login"
  ) {
    return NextResponse.next()
  }

  // Check for token in cookie or header
  const token = request.cookies.get("token")?.value || 
                request.headers.get("authorization")?.replace("Bearer ", "")

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/seller")) {
    // Allow access - auth will be checked on client side
    // TODO: Add proper JWT verification
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    // TODO: Verify token and check for ADMIN role  
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // TODO: Verify token and check for CUSTOMER role
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/seller/:path*", "/admin/:path*", "/dashboard/:path*"],
  type: "route"
}

