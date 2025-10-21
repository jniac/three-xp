import { XpMetadata } from '@/types'

import { ClientPage } from './page.client'

export const metadata = new XpMetadata({
  slug: 'shader-forge/instances',
  status: 'done',
})

export default function Page() {
  return (
    <ClientPage />
  )
}
