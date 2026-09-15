import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'depth-offset-2',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}