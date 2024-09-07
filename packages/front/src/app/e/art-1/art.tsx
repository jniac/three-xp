'use client'

import { useLayoutEffects } from 'some-utils-react/hooks/effects'

import { create } from './create'

export function Art() {
  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    const width = div.clientWidth
    const height = div.clientHeight
    const art = create({ width, height })
    div.appendChild(art.renderer.domElement)
    yield () => div.removeChild(art.renderer.domElement)
  }, [])

  return (
    <div ref={ref} />
  )
}
