'use client'
import Markdown from 'react-markdown'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { PassType } from 'some-utils-three/contexts/webgl'
import { setup } from 'some-utils-three/utils/tree'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'
import { leak } from '@/utils/leak'

import { Main } from './main'

import s from '../md.module.css'
import Readme from './README.md'

function Controller() {
  useThree(function* (three) {
    leak({ three })
    const controls = new VertigoControls({
      size: 60,
      perspective: 1,
      focus: [0, 5, 0],
      rotation: ['-20deg', '30deg', 0],
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
    setup(new Main(), group)
  }, [])
  return null
}

export function Client() {
  return (
    <div>
      <ThreeProvider>
        <Controller />
        <MainComponent />
        <div className='layer thru flex flex-col p-4 gap-2'>
          <Markdown className={s.Markdown}>{Readme}</Markdown>
        </div>
      </ThreeProvider>
    </div>
  )
}