'use client'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { ThreeProvider, useThree } from '@/tools/three-provider'
import { leak } from '@/utils/leak'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { Stage } from './art/stage'

function Controller() {
  useThree(function* (three) {
    leak({ three })
    const controls = new VertigoControls({
      size: 12.2,
      perspective: 0,
    })
    yield controls.start(three.renderer.domElement)
    const ticker = Ticker.get('three')
    ticker.set({ minActiveDuration: 60 })
    yield onTick('three', tick => {
      const { aspect, camera } = three
      controls.update(camera, aspect, tick.deltaTime)
    })
    yield handleKeyboard([
      [{ code: 'Space', modifiers: 'shift' }, () => {
        document.body.requestFullscreen()
      }],
    ])
  }, [])
  return null
}

export function Main() {
  return (
    <div>
      <ThreeProvider>
        <Controller />
        <Stage />
      </ThreeProvider>
    </div>
  )
}