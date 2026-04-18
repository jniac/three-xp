import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'template-3',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}