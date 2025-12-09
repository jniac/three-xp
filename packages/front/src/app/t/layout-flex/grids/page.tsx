import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'layout/grids',
  status: 'done',
})

export default function LayoutGrid2Page() {
  return (
    <div className='LayoutGrid2Page page'>
      <PageClient />
    </div>
  )
}