import { XpMetadata } from '@/types'

import { ClientPage } from './page.client'

export const metadata = new XpMetadata({
  slug: 'ticker/basic',
  status: 'done',
})

export default function Page() {
  return (
    <ClientPage />
  )
}
