'use client'

import { handleSize } from 'some-utils-dom/handle/size'
import { useLayoutEffects } from 'some-utils-react/hooks/effects'

import { create } from './create'

function Gl() {
  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    const width = div.clientWidth
    const height = div.clientHeight
    const art = create({ width, height })
    yield* art.init()
    div.appendChild(art.renderer.domElement)
    yield handleSize(div, {
      onSize: info => {
        art.resize(info.size.x, info.size.y)
      },
    })
    yield () => art.renderer.domElement.remove()
  }, [])

  return (
    <div
      ref={ref}
      className='absolute inset-0'
    />
  )
}

function Svg() {
  return (
    <div
      className='absolute inset-0'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='-512 -512 1024 1024'
        className='w-full h-full'
      >
      </svg>
    </div>
  )

}

export function Art() {
  return (
    <div className='relative'>
      <Gl />
      <Svg />
    </div>
  )
}
