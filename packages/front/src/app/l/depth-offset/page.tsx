import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'depth-offset',
  description: `
    # Depth offset experiment
  `,
  status: 'done',
})

export default function DepthOffsetPage() {
  return (
    <div className='absolute-through flex flex-col items-center justify-center'>
      <Main />
    </div>
  )
}
