'use client'

import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { PassType } from 'some-utils-three/contexts/webgl'

import { leak } from '@/utils/leak'

import { FractalGrid } from './fractal-grid'
import { ThreeProvider, useThree } from './three-provider'

function Settings() {
  useThree(function* (three) {
    const aoPass = new GTAOPass(three.scene, three.camera)
    aoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 2,
      radiusExponent: 2,
      rings: 2,
      samples: 24,
    })
    yield three.pipeline.addPass(aoPass, { type: PassType.PostProcessing })

    leak({ three })
  }, [])
  return null
}

export function Main() {
  return (
    <div className='FractalGrid'>
      <ThreeProvider>
        <h1>FractalGrid</h1>
        <Settings />
        <FractalGrid />
      </ThreeProvider>
    </div>
  )
}