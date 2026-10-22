/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Apache: /configurador/ vira pasta (prefetch do Next); sem index.html dentro dá 403.
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
