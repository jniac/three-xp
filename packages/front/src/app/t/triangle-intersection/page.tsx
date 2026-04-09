import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'triangle-intersection',
  status: 'wip',
  description: 'TODO: Make demo of ray-triangle intersection that includes geometry sampling',
})

export default function Page() {
  return (
    <div className='layer p-4'>
      <h1 className='text-2xl text-bold'>
        Triangle Intersection
      </h1>
      <PageClient />
    </div>
  )
}
