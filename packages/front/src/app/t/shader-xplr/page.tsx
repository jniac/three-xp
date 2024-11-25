import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'shader-xplr',
  status: 'done',
})

export default function ShaderXplrPage() {
  return (
    <div className='ShaderXplrPage page'>
      <Client />
    </div>
  )
}