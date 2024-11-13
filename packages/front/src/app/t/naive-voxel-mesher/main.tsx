'use client'


import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'
import { leak } from '@/utils/leak'

import { setup } from 'some-utils-three/utils/tree'
import { Stage } from './stage'

function Controller() {
  useThree(function* (three) {
    leak({ three })
    const controls = new VertigoControls({
      size: 10,
      perspective: 1,
    })
    yield controls.initialize(three.renderer.domElement)
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

function MainComponent() {
  useGroup('main', function* (group) {
    setup(new Stage(), group)
  }, [])
  return null
}

export function Main() {
  return (
    <div>
      <ThreeProvider>
        <Controller />
        <MainComponent />
      </ThreeProvider>
    </div>
  )
}