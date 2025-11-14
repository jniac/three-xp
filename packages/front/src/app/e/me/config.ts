import { isHosted } from 'some-utils-ts/misc/is-hosted'

import { XpMetadata } from '@/types'

export const VERSION = '0.0.2'

export const meMetadata = new XpMetadata({
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

export const assetPaths = isHosted()
  ? '/three-xp/assets'
  : '/assets'