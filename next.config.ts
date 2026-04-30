import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'sharp',
    '@imgly/background-removal-node',
    '@prisma/client',
    'prisma',
  ],
}

export default nextConfig
