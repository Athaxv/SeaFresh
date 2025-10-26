"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon?: "bag" | "package" | "cart"
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
}

export function EmptyState({ icon = "bag", title, description, ctaLabel, ctaHref, onCtaClick }: EmptyStateProps) {
  const icons = {
    bag: ShoppingBag,
    package: Package,
    cart: ShoppingCart,
  }

  const Icon = icons[icon]

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {ctaLabel && (
        <>
          {ctaHref ? (
            <Link href={ctaHref}>
              <Button>{ctaLabel}</Button>
            </Link>
          ) : (
            <Button onClick={onCtaClick}>{ctaLabel}</Button>
          )}
        </>
      )}
    </div>
  )
}



