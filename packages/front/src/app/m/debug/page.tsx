import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'context-test',
})

export default function ContextTestPage() {
  return (
    <div className='ContextTestPage page'>
      <PageClient />
    </div>
  )
}