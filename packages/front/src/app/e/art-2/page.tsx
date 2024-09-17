import { XpMetadata } from '@/types'

import { Main } from './main'

export const metadata = new XpMetadata({
  title: 'art-2',
  slug: 'art-2',
  description: `
    # Graphic Art 2
  `,
})

export default function Exp1() {
  return (
    <div className='Art2 page'>
      <Main />
    </div>
  )
}