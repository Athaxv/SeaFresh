"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { itemCount } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/98 backdrop-blur-md shadow-md" : "bg-white/95 backdrop-blur-md"
      } border-b border-primary/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">SeaFresh</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-muted rounded-full px-4 py-2 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search seafood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-32 placeholder:text-muted-foreground"
              />
            </form>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-once">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50">
                  {!user ? (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href={user.role === "SELLER" ? "/seller/dashboard" : user.role === "ADMIN" ? "/admin" : "/dashboard"}
                        className="block px-4 py-2 hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {user.role === "SELLER" ? "Seller Dashboard" : user.role === "ADMIN" ? "Admin Panel" : "My Dashboard"}
                      </Link>
                      <div className="border-t border-border">
                        <button
                          onClick={() => {
                            localStorage.removeItem("token")
                            localStorage.removeItem("user")
                            setUser(null)
                            setUserMenuOpen(false)
                            window.location.href = "/"
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/shop" className="block px-4 py-2 hover:bg-muted rounded">
              Shop
            </Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-muted rounded">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-muted rounded">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
