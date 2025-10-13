import { XpMetadata } from '@/types'

import { ClientPage } from './page.client'

export const metadata = new XpMetadata({
  slug: 'me',
  title: 'Joseph M.',
  openGraph: {
    title: 'Joseph M. — Visual Tech Artist',
    description: 'I am Joseph M., a Visual Tech Artist based in Paris, France. I create interactive 3D experiences on the web, blending art and technology to craft immersive digital worlds.',
    images: [
      '../assets/images/me.jpg'
    ]
  }
})

export default function FractalGridPage() {
  return (
    <ClientPage />
  )
}
