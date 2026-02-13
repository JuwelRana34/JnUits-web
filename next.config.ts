import type { NextConfig } from 'next'

import path from 'path'

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
