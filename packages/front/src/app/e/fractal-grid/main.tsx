'use client'

import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { PassType } from 'some-utils-three/contexts/webgl'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

import { FractalGrid } from './fractal-grid'
import { ThreeProvider, useThree } from './three-provider'

function Settings() {
  useThree(function* (three) {
    leak({ three })
    const controls = new VertigoControls({
      size: 24,
    })
    yield controls.initialize(three.renderer.domElement)
    yield onTick('three', tick => {
      const { aspect, camera } = three
      controls.update(camera, aspect, tick.deltaTime)
    })

    const aoPass = new GTAOPass(three.scene, three.camera)
    aoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 1,
      radiusExponent: 2,
      rings: 2,
      samples: 24,
    })
    yield three.pipeline.addPass(aoPass, { type: PassType.PostProcessing })
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