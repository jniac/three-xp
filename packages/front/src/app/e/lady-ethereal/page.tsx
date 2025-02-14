import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'ui-a-lot',
})

export default function FractalGridPage() {
  return (
    <div className='FractalGridPage page'>
      <Main />
    </div>
  )
}