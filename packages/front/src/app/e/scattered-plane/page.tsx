import { XpMetadata } from '@/types'

import { ThreeXpHeader } from '@/components/three-xp-header'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'scattered-plane',
})

export default function ScatteredPlane() {
  return (
    <div className='ScatteredPlane page'>
      <ThreeXpHeader>
        <Client />
      </ThreeXpHeader>
    </div>
  )
}