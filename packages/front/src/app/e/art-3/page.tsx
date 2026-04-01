import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'art-3',
  description: `
    # Graphic Art 3
  `,
})

export default function Exp1() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}