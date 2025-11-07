import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'drag-and-decay/toggle',
  status: 'done',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}
