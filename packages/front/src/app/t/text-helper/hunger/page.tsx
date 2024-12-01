import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'text-helper/hunger',
})

export default function HungerPage() {
  return (
    <div className='HungerPage page'>
      <Client />
    </div>
  )
}
