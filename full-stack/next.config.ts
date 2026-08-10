import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  watchOptions: {
    pollIntervalMs: 1000, // poll every 1s instead of relying on native fs events
  },
}

export default nextConfig
