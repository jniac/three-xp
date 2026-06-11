import { XpMetadata } from '@/types'

import PageClient from './page.client'

export const metadata = new XpMetadata({
  slug: 'gaussian-mipmaps',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}