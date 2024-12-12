import { XpMetadata } from '@/types'

import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'webgpu/tsl-demo',
})

export default function Page() {
  return (
    <div className='page'>
      <Client />
    </div>
  )
}
