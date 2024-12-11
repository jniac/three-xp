import path from 'path'

const isProd = process.env.NODE_ENV === 'production'

const logOnce = (() => {
  const logs = new Set()
  return (msg) => {
    if (!logs.has(msg)) {
      logs.add(msg)
      console.log(msg)
    }
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  distDir: isProd ? '../../docs' : '.next',
  assetPrefix: isProd ? '/three-xp/' : '',

  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Deliver svg from public assets folder (double usage of svg, as source file (component) or as asset).
    const svgFolder = path.join(import.meta.dirname, 'public/assets/svg') // Node 20
    logOnce(`   SVG Folder: ${svgFolder}`)
    config.resolve.alias['@svg'] = svgFolder
    config.module.rules.push({
      test: /^@svg\/.*\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default nextConfig
