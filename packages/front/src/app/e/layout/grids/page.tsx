import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'layout/grids',
})

export default function LayoutGrid2Page() {
  return (
    <div className='LayoutGrid2Page page'>
      <Client />
    </div>
  )
}