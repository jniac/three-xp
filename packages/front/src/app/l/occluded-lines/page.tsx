import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'occluded-lines',
})

export default function DepthOffsetPage() {
  return (
    <div className='absolute-through flex flex-col items-center justify-center'>
      <Main />
    </div>
  )
}
