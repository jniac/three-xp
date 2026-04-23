import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

import page from './page.yaml'

export const metadata = new XpMetadata(page)

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}