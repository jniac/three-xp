import { XpMetadata } from '@/types'

import { Main } from './page.client'

export const metadata = new XpMetadata({
  slug: 'art-3/stencil-test/simple',
})

export default function Page() {
  return (
    <div className='page'>
      <h1>
        Direct Stencil Test
      </h1>
      <p>
        Direct = without any "three" provider.
      </p>
      <Main />
    </div>
  )
}