
import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  title: 'Fuzzy Range',
  slug: 'fuzzy-range',
  description: 'Fuzzy Range utility test page',
  status: 'done',
})

export default async function Page() {
  return (
    <Main />
  )
}
