"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `?${params.toString()}`
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(getPageUrl(page))
      // Scroll to top of products
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust start and end to always show fixed number of pages around current
      if (start === 2 && end < 4) {
        end = Math.min(totalPages - 1, 4)
      }
      if (end === totalPages - 1 && start > totalPages - 3) {
        start = Math.max(2, totalPages - 3)
      }

      // Add ellipsis after first page
      if (start > 2) {
        pages.push("...")
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 my-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            )
          }

          const pageNum = Number(page)
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(pageNum)}
              className="min-w-[2.5rem]"
            >
              {pageNum}
            </Button>
          )
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}


