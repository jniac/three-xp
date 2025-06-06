import { XpMetadata } from '@/types'

import { Client } from './client'

export const metadata = new XpMetadata({
  slug: 'offset',
  title: 'Vertigo Offset Widget',
  status: 'wip',
})

export default function VertigoWidgetPage() {
  return (
    <div className='VertigoWidgetPage page'>
      <Client />
    </div>
  )
}
