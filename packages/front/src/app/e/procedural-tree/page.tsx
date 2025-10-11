import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'procedural-tree',
  status: 'wip',
})

export default function Exp1() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}
