import { XpMetadata } from '@/types'

import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'path-with-loop',
  status: 'done',
})

export default function PathWithLoopPage() {
  return (
    <div className='PathWithLoopPage page'>
      <Client />
    </div>
  )
}