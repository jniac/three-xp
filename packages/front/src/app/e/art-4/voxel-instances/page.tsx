import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'art-4/voxel-instances',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}
