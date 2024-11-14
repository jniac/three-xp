'use client'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { PassType } from 'some-utils-three/contexts/webgl'
import { setup } from 'some-utils-three/utils/tree'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'
import { leak } from '@/utils/leak'

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

    const aoPass = new GTAOPass(three.scene, three.camera)
    aoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 100,
      radiusExponent: 2,
      rings: 2,
      samples: 16,
    })
    three.pipeline.addPass(aoPass, { type: PassType.PostProcessing })
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