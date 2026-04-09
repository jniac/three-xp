import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'mesh-walk/ivy',
  status: 'wip',
  description: 'TODO: Implement surface walker that can walk on arbitrary meshes, and use it to make an ivy demo',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}