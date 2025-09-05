import { XpMetadata } from '@/types'
import { Client } from './page.client'

export const metadata = new XpMetadata({
  slug: 'template-2',
})

export default function TemplatePage2() {
  return (
    <div className='TemplatePage2 page'>
      <Client />
    </div>
  )
}
