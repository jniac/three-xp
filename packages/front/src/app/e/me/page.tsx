import { XpMetadata } from '@/types'

import { Home } from './home/home'

export const metadata = new XpMetadata({
  slug: 'me',
  title: 'Joseph M.',
  description: 'Design, programming, looking for resonance in the digital world.',
  openGraph: {
    title: 'Joseph M. — Visual Tech Artist',
    description: 'Design, programming, looking for resonance in the digital world.',
    images: [
      '../assets/images/me.jpg'
    ]
  }
})

export default function Page() {
  return (
    <Home />
  )
}
