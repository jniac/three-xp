import { Metadata } from 'next'
import Link from 'next/link'

import * as aoTransparent from './ao-transparent/page'
import * as art1 from './art-1/page'
import * as art2 from './art-2/page'
import * as pathWithLoop from './path-with-loop/page'
import * as twoEnvDemo from './two-env-demo/page'

const experiments = {
  art1,
  art2,
  aoTransparent,
  pathWithLoop,
  twoEnvDemo,
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