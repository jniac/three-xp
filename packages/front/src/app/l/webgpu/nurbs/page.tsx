import { XpMetadata } from '@/types'

import { SafeClient } from './client.safe'

export const metadata = new XpMetadata({
  slug: 'webgpu/nurbs',
})

export default function Page() {
  return (
    <div className='page'>
      <SafeClient />
    </div>
  )
}
