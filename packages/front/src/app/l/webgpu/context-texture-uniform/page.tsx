import { XpMetadata } from '@/types'

import { SafeClient } from './client.safe'

export const metadata = new XpMetadata({
  slug: 'webgpu/context-texture-uniform',
  status: 'done',
})

export default function Page() {
  return (
    <div className='page'>
      <SafeClient />
    </div>
  )
}
