'use client'
import { DeleteIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Space } from 'some-utils-ts/experimental/layout/flex'
import { computeLayout4 } from 'some-utils-ts/experimental/layout/flex/computeLayout-4'
import { RectangleDeclaration } from 'some-utils-ts/math/geom/rectangle'

import { leak } from '@/utils/leak'

import { CanvasBlock } from '../../shared/flex-layout-demo'
import { layoutColorRule, randomColorRule } from '../fit-children/demo/shared'
import { computeLayout3 } from '../flex-algo/computeLayout-3'

import { layouts, layoutsByTags } from './layouts'

import '../../shared/flex-layout-demo.css'
import { computeLayout2 } from '../flex-algo/computeLayout-2'

type ComputeLayoutFn = (root: Space, rootRect?: RectangleDeclaration) => void

const computeLayoutOptions = [
  computeLayout2,
  computeLayout3,
  computeLayout4,
]

function Content({
  computeLayout = computeLayout4,
}: {
  computeLayout?: ComputeLayoutFn,
}) {
  leak({ Space })

  const router = useRouter()
  const searchParams = useSearchParams()

  const layoutKey = searchParams.get('layout')
  const tagName = searchParams.get('tag')
  const filteredLayouts = layouts.filter(layout => !tagName || layout.tags.includes(tagName))
  const hashIndex = filteredLayouts.findIndex(layout => layout.key === layoutKey)

  layouts.forEach(layout => {
    console.log(`Layout "${layout.name}" tags: ${layout.tags.join(', ')}`)
  })

  const blocks = filteredLayouts
    .filter((_, i) => hashIndex === -1 || hashIndex === i)
    .map(layout => {
      return () => {
        try {
          const roots = layout.getRoots(layout.size)
          for (const root of roots) {
            computeLayout(root)
          }
          return (
            <CanvasBlock
              key={layout.name}
              title={layout.name}
              description={layout.description}
              size={layout.size}
              computeLayout={computeLayout}
              colorRule={layout.props.randomColors ? randomColorRule : layoutColorRule}
              root={roots}
              {...layout.props}
            />
          )
        } catch (error) {
          console.error('Error rendering layout:', error)
          return (
            <div className='p-4 border border-red-500 text-red-500'>
              <h2 className='text-xl font-bold mb-2'>Error rendering layout</h2>
              <h3 className='text-lg font-semibold mb-2'>{layout.key} "{layout.name}"</h3>
              <pre className='text-sm'>{error instanceof Error ? error.message : String(error)}</pre>
            </div>
          )
        }
      }
    })
  return (
    <div className='h-full p-16 overflow-auto no-scrollbar'>
      <h1 className='text-3xl text-center font-bold'>
        {computeLayout.name}() {(layoutKey && `[${layoutKey}]`) || (tagName && `#${tagName}`) || 'all tags'}
      </h1>

      {blocks.map((Block, i) => (
        <div key={i} className='my-8' onClick={() => {
          const params = new URLSearchParams(window.location.search)
          if (hashIndex === -1) {
            params.set('layout', filteredLayouts[i].key)
          } else {
            params.delete('layout')
          }
          router.push(`${window.location.pathname}?${params.toString()}`)
        }}>
          <Block />
        </div>
      ))}
    </div>
  )
}

function SelectHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const SelectBlock = ({
    prefix,
    options,
    paramKey,
    Icon,
  }: {
    prefix?: React.ReactNode
    options: string[]
    paramKey: string
    Icon: React.FC<{ size?: string | number, strokeWidth?: number }>
  }) => {
    return (
      <div className='flex flex-row items-center border border-[#fff3] rounded pl-2 pr-1 backdrop-blur-lg'>
        {prefix}
        <select
          onChange={e => {
            const params = new URLSearchParams(window.location.search)
            const value = e.target.value
            if (value === 'all') {
              params.delete(paramKey)
            } else {
              params.set(paramKey, e.target.value)
            }
            router.push(`${window.location.pathname}?${params.toString()}`)
          }}
          value={searchParams.get(paramKey) ?? 'all'}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div
          className='ml-2 p-2 cursor-pointer'
          onClick={() => {
            const params = new URLSearchParams(window.location.search)
            params.delete(paramKey)
            router.push(`${window.location.pathname}?${params.toString()}`)
          }}
        >
          <Icon size='1.2em' strokeWidth={1.5} />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-row gap-1'>
      <SelectBlock
        options={computeLayoutOptions.map(option => option.name)}
        paramKey='fn'
        Icon={DeleteIcon}
      />
      <SelectBlock
        prefix='#'
        options={layoutsByTags.keys().toArray()}
        paramKey='tag'
        Icon={DeleteIcon}
      />
    </div >
  )
}

function PureClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fnName = searchParams.get('fn')
  const tagName = searchParams.get('tag')

  const computeLayout = computeLayoutOptions.find(option => option.name === fnName)

  return (
    <div className='page'>
      <div className='fixed z-10 top-0 w-full h-16 flex flex-row items-center justify-end p-4'>
        {computeLayout && (
          <SelectHeader />
        )}
        <div className='flex-1' />
        <button>
          <XIcon
            onClick={() => {
              const params = new URLSearchParams(window.location.search)
              params.delete('fn')
              params.delete('tag')
              router.push(`${window.location.pathname}?${params.toString()}`)
            }}
          />
        </button>
      </div>
      {computeLayout
        ? <Content computeLayout={computeLayout} />
        : (
          <div className='p-16 h-screen'>
            <h1 className='text-3xl text-center font-bold mb-8'>
              Select computeLayout version
            </h1>
            <div className='flex flex-col items-center gap-4'>
              <div className='flex flex-row gap-1'>
                {layoutsByTags.keys().toArray().map(tag => (
                  <button
                    key={tag}
                    className={`px-4 py-2 border rounded ${tag === tagName || (tag === 'all' && !tagName) ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search)
                      if (params.get('tag') === tag || tag === 'all') {
                        params.delete('tag')
                      } else {
                        params.set('tag', tag)
                      }
                      router.push(`${window.location.pathname}?${params.toString()}`)
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {computeLayoutOptions.map((option, i) => (
                <button
                  key={i}
                  className='px-4 py-2 border rounded'
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search)
                    params.set('fn', option.name)
                    router.push(`${window.location.pathname}?${params.toString()}`)
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

export function PageClient() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    setOk(true)
  }, [])
  return ok && <PureClient />
}