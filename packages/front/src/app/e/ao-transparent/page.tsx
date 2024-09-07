import { ExpMetadata } from '../types'
import { Main } from './main'

export const metadata: ExpMetadata = {
  title: 'ao-transparent',
  slug: 'ao-transparent',
  description: 'Ambient Occlusion and Transparent together',
}

export default function AoTransparentPage() {
  return (
    <div className='page'>
      <Main />
    </div>
  )
}