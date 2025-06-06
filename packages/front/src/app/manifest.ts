import type { MetadataRoute } from 'next'

export const dynamic = 'force-static' // ✅ required for export

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Threejs Experiments',
    short_name: 'three-xp',
    description: 'Next.js + Three.js experiments',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/diamond-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/diamond-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}