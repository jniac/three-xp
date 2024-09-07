import { Metadata } from 'next'

import Link from 'next/link'
import * as expriments from '.'

export const metadata: Metadata = {
  title: 'Three.js experiments',
}

export default function ExperimentsPage() {
  return (
    <div className='page'>
      {Object.entries(expriments).map(([key, value]) => (
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