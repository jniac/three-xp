
import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'variable/demo',
  status: 'done',
})

export default async function Page() {
  return (
    <PageClient />
  )
}
