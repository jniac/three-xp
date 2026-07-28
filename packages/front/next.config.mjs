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
    config.module.exprContextCritical = false // Suppress critical dependency warnings for dynamic imports (eg.: Rapier with three.js)

    const nextImageRule = config.module.rules.find(
      (rule) => rule?.loader === 'next-image-loader',
    )

    if (nextImageRule) {
      const base64Query = { not: [/base64/] }
      nextImageRule.resourceQuery = nextImageRule.resourceQuery
        ? { and: [nextImageRule.resourceQuery, base64Query] }
        : base64Query
    }

    config.module.rules.push(
      {
        test: /\.(png|jpe?g|webp|gif|avif)$/i,
        resourceQuery: /base64/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: Infinity,
          },
        },
      },
      {
        resourceQuery: /raw/, // support ?raw
        type: 'asset/source',
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /raw/, // support ?raw (e.g. import icon from './icon.svg?raw')
            type: 'asset/source',
          },
          {
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
          }
        ],
      }
    )

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
