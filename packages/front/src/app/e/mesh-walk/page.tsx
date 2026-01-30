import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'mesh-walk',
})

export default function TemplatePage() {
  return (
    <div className='TemplatePage page'>
      <PageClient />
    </div>
  )
}