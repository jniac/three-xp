import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'dots-and-falloffs',
  status: 'done',
})

export default function DotsAndFalloffs() {
  return (
    <div className='DotsAndFalloffs page'>
      <Main />
    </div>
  )
}