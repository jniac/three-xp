'use client'

import { useEffect, useState } from 'react'

/**
 * How prevent Next.js from loading on the server side the 'three/webgpu' module 
 * (which is not supported in Node.js at the time of writing)?
 * 
 * By using dynamic imports and relying on the client-side rendering.
 */
export function SafeClient() {
  const [module, setModule] = useState<any>(null)
  useEffect(() => {
    import('./client')
      .then(module => setModule(module))
  }, [])
  return module
    ? <module.Client />
    : <div className='layer col-center'>loading...</div >
}
