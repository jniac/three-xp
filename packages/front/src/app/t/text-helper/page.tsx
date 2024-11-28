import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'text-helper',
})

export default function TextHelperPage() {
  return (
    <div className='TextHelperPage page'>
      <Client />
    </div>
  )
}