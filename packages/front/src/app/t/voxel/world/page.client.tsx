'use client'
import Markdown from 'react-markdown'
import { BufferGeometry, Mesh } from 'three'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { PassType } from 'some-utils-three/contexts/webgl'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { Ticker } from 'some-utils-ts/ticker'
import { tryCast } from 'some-utils-ts/types/cast'

import { leak } from '@/utils/leak'

import { Main } from './main'

import s from '../md.module.css'

import Readme from './README.md'

function ThreeSettings() {
  useThreeWebGL(async function* (three) {
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

  useGroup('debug', async function* (group, three) {
    const controls = await Message.waitForInstance(VertigoControls)
    const helper = setup(new DebugHelper().onTop(), group)
    yield three.ticker.onTick(() => {
      helper.clear()
      tryCast(controls.downIntersection?.object, Mesh, mesh => {
        (mesh.geometry as BufferGeometry).computeBoundingBox()
        const bounds = (mesh.geometry as BufferGeometry).boundingBox!
        helper.setTransformMatrix(mesh.matrixWorld)
        helper.box(bounds, { color: 'red' })
      })
    })
  }, [])

  return null
}

function MainComponent() {
  useGroup('main', function* (group) {
    setup(new Main(), group)
  }, [])
  return null
}

export function PageClient() {
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