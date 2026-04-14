'use client'
import Markdown from 'react-markdown'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { PassType } from 'some-utils-three/contexts/webgl'
import { setup } from 'some-utils-three/utils/tree'
import { Ticker } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

import { Main } from './main'

import s from '../md.module.css'

import Readme from './README.md'

function ThreeSettings() {
  useThreeWebGL(function* (three) {
    leak({ three })
    const ticker = Ticker.get('three')
    ticker.set({ minActiveDuration: 60 })
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
      <ThreeProvider
        vertigoControls={{
          size: 50,
          rotation: '-20deg, -45deg, 0'
        }}
      >
        <ThreeSettings />
        <MainComponent />
        <div className='layer thru flex flex-col p-4 gap-2'>
          <Markdown className={s.Markdown}>{Readme}</Markdown>
        </div>
      </ThreeProvider>
    </div>
  )
}