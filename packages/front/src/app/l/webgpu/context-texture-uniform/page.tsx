import { XpMetadata } from '@/types'

import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'webgpu/context-texture-uniform',
})

export default function Page() {
  return (
    <div className='page'>
      <Client />
    </div>
  )
}
