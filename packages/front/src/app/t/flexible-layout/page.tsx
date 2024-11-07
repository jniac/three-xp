import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'flexible-layout',
})

export default function FlexibleLayoutPage() {
  return (
    <div className='FlexibleLayoutPage page'>
      <Client />
    </div>
  )
}
