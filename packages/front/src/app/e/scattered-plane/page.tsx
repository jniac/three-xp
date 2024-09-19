import { XpMetadata } from '@/types'

import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'scattered-plane',
})

export default function ScatteredPlane() {
  return (
    <div className='ScatteredPlane page'>
      <Client />
    </div>
  )
}