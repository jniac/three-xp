import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'from-earth-to',
  status: 'done',
})

export default function FromEarthToPage() {
  return (
    <div className='FromEarthToPage page'>
      <Main />
    </div>
  )
}
