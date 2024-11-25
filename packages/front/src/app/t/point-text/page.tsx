import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'point-text',
})

export default function PointTextPage() {
  return (
    <div className='PointTextPage page'>
      <Client />
    </div>
  )
}