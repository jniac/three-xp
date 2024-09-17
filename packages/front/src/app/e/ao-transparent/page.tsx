import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  title: 'ao-transparent',
  slug: 'ao-transparent',
  description: 'Ambient Occlusion and Transparent together',
})

export default function AoTransparentPage() {
  return (
    <div className='page'>
      <Main />
    </div>
  )
}