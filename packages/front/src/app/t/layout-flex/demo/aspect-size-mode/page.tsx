import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'layout-flex/demo/aspect-size-mode',
  status: 'done',
})

export default function Page() {
  return (
    <PageClient />
  )
}