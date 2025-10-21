import { XpMetadata } from '@/types'

import { ClientPage } from './page.client'

export const metadata = new XpMetadata({
  slug: 'slerp-vectors',
  status: 'done',
})

export default function Page() {
  return (
    <ClientPage />
  )
}
