// Array of all available seafood images from the public folder
export const seafoodImages = [
  "/fresh-catla-fish-bengali-cut.jpg",
  "/fresh-cleaned-squid-medium.jpg",
  "/fresh-mackerel-fish-whole-cleaned.jpg",
  "/fresh-medium-prawns-on-wooden-board.jpg",
  "/fresh-prawns-on-plate-seafood.jpg",
  "/fresh-premium-seafood-prawns-fish-on-ice.jpg",
  "/fresh-rohu-fish-bengali-cut.jpg",
  "/small-freshwater-prawns-cleaned.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_059322b4.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_3081f2f5.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_3cddfa30.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_561a11a5.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_58115bfa.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_62f43966.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_70f6a36e.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_755163c5.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_7f82eb01.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_8576ca39.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_860a9502.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_8a25f0b6.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_a82f8dfe.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_da689c73.jpg",
  "/WhatsApp Image 2025-11-17 at 00.02.36_fa74fd6d.jpg",
]

/**
 * Get a random seafood image from the available collection
 */
export function getRandomSeafoodImage(): string {
  const randomIndex = Math.floor(Math.random() * seafoodImages.length)
  return seafoodImages[randomIndex]
}

/**
 * Handle image error by replacing with a random seafood image
 * @param event - The error event from the image element
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget
  // Get the pathname from the full URL to check if it's already a seafood image
  let currentPath = img.src
  try {
    // Try to parse as URL (works for absolute URLs)
    const url = new URL(img.src)
    currentPath = url.pathname
  } catch {
    // If it's a relative path, use it as is
    currentPath = img.src.startsWith('/') ? img.src : `/${img.src}`
  }
  
  // Prevent infinite loop if seafood image also fails
  const isSeafoodImage = seafoodImages.some(seafoodImg => currentPath.includes(seafoodImg))
  
  if (!isSeafoodImage) {
    img.src = getRandomSeafoodImage()
  } else {
    // If seafood image fails, fallback to placeholder
    img.src = "/placeholder.svg"
  }
}

