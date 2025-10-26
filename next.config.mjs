/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    '*': [
      'C:\\Users\\**\\Application Data\\**',
      'C:\\ProgramData\\**',
      'C:\\Windows\\**',
    ],
  },
}

export default nextConfig
