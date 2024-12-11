'use client'

import { useEffect, useState } from 'react'

function Loading() {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      loading...
    </div>
  )
}

let ServerProofComponent = Loading

/**
 * Convolutions to load webgpu (three/tsl) without the dreaded SSR "self is not defined" error.
 */
export function ServerProof() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    let mounted = true
    import('./choose-one').then(module => {
      if (mounted) {
        ServerProofComponent = module.ChooseOne
        forceUpdate(Math.random())
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className='flex flex-col gap-2'>
      <div className='absolute-through'>
        <ServerProofComponent />
      </div>
    </div>
  )
}
