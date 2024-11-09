import { XpMetadata } from '@/types'
import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'four-circles',
})

export default function FourCirclesPage() {
  return (
    <div className='FourCirclesPage page'>
      <Main />
    </div>
  )
}