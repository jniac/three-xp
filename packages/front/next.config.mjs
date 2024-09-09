
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  distDir: isProd ? '../../docs' : '.next',
  assetPrefix: isProd ? '/three-xp/' : '',
}

export default nextConfig
