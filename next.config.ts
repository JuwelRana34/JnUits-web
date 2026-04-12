import type { NextConfig } from 'next'

import path from 'path'

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
      },
    ],
  },

  serverExternalPackages: ['sslcommerz-lts'],
}

export default nextConfig
