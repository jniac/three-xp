import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'scroll',
  status: 'wip',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}