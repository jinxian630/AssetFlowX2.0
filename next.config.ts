import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // External packages that should not be bundled by Next.js
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
}

export default nextConfig
