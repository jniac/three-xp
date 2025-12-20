
import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'layout-flex/demo/compute-layout-3/three',
  status: 'done',
})

export default function Page() {
  return (
    <PageClient />
  )
}
