import { XpMetadata } from '@/types'

import Client from './client'

export const metadata = new XpMetadata({
  slug: 'context-test',
})

export default function ContextTestPage() {
  return (
    <div className='ContextTestPage page'>
      <Client />
    </div>
  )
}