'use client'

import { useThree } from 'some-utils-misc/three-provider'

export function FullscreenButton() {
  const three = useThree()
  return (
    <button
      className='absolute top-12 right-12 z-10 border border-white/50 hover:bg-black/10 hover:border-white text-white px-2 py-1 rounded transition'
      onClick={() => three.setFullscreen('canvas')}
    >
      Fullscreen
    </button>
  )
}
