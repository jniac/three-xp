import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'zig-zag',
  status: 'wip',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}
