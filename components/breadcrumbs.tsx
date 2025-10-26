"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface Breadcrumb {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: Breadcrumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {/* Home */}
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home className="w-4 h-4" />
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {isLast ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link href={item.href || "#"} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}




