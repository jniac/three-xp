import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  title: 'dots-and-falloffs',
  slug: 'dots-and-falloffs',
  description: `
    # Graphic Art 2
  `,
})

export default function DotsAndFalloffs() {
  return (
    <div className='DotsAndFalloffs page'>
      <Main />
    </div>
  )
}