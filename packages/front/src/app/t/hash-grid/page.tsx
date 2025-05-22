import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'hash-grid',
  status: 'done',
})

export default function HashGridPage() {
  return (
    <div className='HashGridPage page'>
      <Client />
    </div>
  )
}