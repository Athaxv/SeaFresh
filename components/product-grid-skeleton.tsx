export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square bg-muted rounded-lg mb-4" />

          {/* Content Skeleton */}
          <div className="space-y-3">
            {/* Title */}
            <div className="h-4 bg-muted rounded w-3/4" />
            
            {/* Price & Weight */}
            <div className="flex items-center justify-between">
              <div className="h-5 bg-muted rounded w-20" />
              <div className="h-4 bg-muted rounded w-16" />
            </div>
            
            {/* Rating & Origin */}
            <div className="flex items-center gap-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded w-32" />
            </div>
            
            {/* Button */}
            <div className="h-10 bg-muted rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}




