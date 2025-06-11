import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'template',
})

export default function TemplatePage() {
  return (
    <div className='TemplatePage page'>
      <Client />
    </div>
  )
}