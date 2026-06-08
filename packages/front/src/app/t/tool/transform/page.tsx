import { XpMetadata } from '@/types'

import PageClient from './page.client'

export const metadata = new XpMetadata({
  slug: 'tool/transform',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}