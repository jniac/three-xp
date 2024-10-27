import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'layout/grid-1',
})

export default function LayoutGrid1Page() {
  return (
    <div className='LayoutGrid1Page page'>
      <Client />
    </div>
  )
}