import { XpMetadata } from '@/types'
import { Client } from './page.client'

export const metadata = new XpMetadata({
  slug: 'fun/extrusion',
})

export default function ExtrusionPage() {
  return (
    <div className='ExtrusionPage page'>
      <Client />
    </div>
  )
}
