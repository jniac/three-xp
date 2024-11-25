import Link from 'next/link'
import { Metadata } from 'next/types'
import { HTMLAttributes } from 'react'

import { makeClassName } from 'some-utils-react/utils/classname'

import { XpMetadata } from '@/types'

type Props = HTMLAttributes<HTMLDivElement> & {
  metadata: Metadata
  pages: Record<string, { metadata: XpMetadata }>
  path: string
}

export function SummaryPage(props: Props) {
  const { className, metadata, pages, children, path } = props
  return (
    <div className={makeClassName(className, 'page gap-1')}>
      <h1 className='text-3xl mb-4'>{String(metadata.title)}</h1>
      {Object.entries(pages).map(([key, value]) => {
        if (!value.metadata) {
          throw new Error(`metadata is undefined for key "${key}"`)
        }
        return (
          <div key={key}>
            <span>
              <Link
                href={`${path}/${value.metadata.slug}`}
                className='hover:underline hover:text-[#e08ac6]'
                style={{
                  opacity: value.metadata.status === 'done' ? 1 : 0.5,
                  fontStyle: value.metadata.status === 'done' ? 'normal' : 'italic',
                }}
              >
                {value.metadata.title.toString()}
              </Link>
            </span>
          </div>
        )
      })}
      {children}
    </div>
  )
}
