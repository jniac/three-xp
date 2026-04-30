
import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'layout-flex/aspect-distribution',
  status: 'done',
})

export default function Page() {
  return (
    <PageClient />
  )
}
