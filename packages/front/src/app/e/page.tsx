import { Metadata } from 'next'
import Link from 'next/link'

import * as aoTransparent from './ao-transparent/page'
import * as art1 from './art-1/page'

const experiments = {
  art1,
  aoTransparent,
}

export const metadata: Metadata = {
  title: 'Three.js experiments',
}

export default function ExperimentsPage() {
  return (
    <div className='page'>
      {Object.entries(experiments).map(([key, value]) => (
        <div key={key}>
          <span>
            <Link href={`e/${value.metadata.slug}`}>
              {value.metadata.title?.toString()}
            </Link>
          </span>
        </div>
      ))}
    </div>
  )
}