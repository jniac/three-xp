import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'css-3d',
})

export default function CSS3DPage() {
  return (
    <div className='CSS3DPage page'>
      <Client />
    </div>
  )
}