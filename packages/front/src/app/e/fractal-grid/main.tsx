'use client'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

import { FractalGrid } from './fractal-grid'
import { ThreeProvider, useThree } from './three-provider'

function Controller() {
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
  }, [])
  return null
}

export function Main() {
  return (
    <div className='FractalGrid'>
      <ThreeProvider>
        <h1>FractalGrid</h1>
        <Controller />
        <FractalGrid />
      </ThreeProvider>
    </div>
  )
}