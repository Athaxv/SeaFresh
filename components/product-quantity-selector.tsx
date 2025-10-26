"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface ProductQuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function ProductQuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}: ProductQuantitySelectorProps) {
  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        className="h-10 w-10"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="flex items-center justify-center min-w-[3rem]">
        <span className="text-lg font-semibold">{quantity}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        className="h-10 w-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}




