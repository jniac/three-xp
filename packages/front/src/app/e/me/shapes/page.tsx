import { XpMetadata } from '@/types'
import { ShapesPage } from './shapes'

export const metadata = new XpMetadata({
  slug: 'me',
  title: 'Joseph M.',
  description: 'Design, programming, seeking grace in the digital world.',
  openGraph: {
    title: 'Joseph M. — Visual Tech Artist',
    // description: 'Design, programming, seeking grace in the digital world.',
    description: 'Designing, programming, chasing resonances in the digital world.',
    images: [
      '../assets/images/me.jpg'
    ]
  }
})

export default function Page() {
  return (
    <ShapesPage />
  )
}
