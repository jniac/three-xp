'use client'

import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { PassType } from 'some-utils-three/contexts/webgl'
import { TextHelper } from 'some-utils-three/helpers/text-helper'
import * as Loop from 'some-utils-ts/iteration/loop'
import { lerp } from 'some-utils-ts/math/basic'
import { calculateExponentialDecayLerpRatio, calculateExponentialDecayLerpRatio2 } from 'some-utils-ts/math/misc/exponential-decay'

import { leak } from '@/utils/leak'

import { CameraHandler } from './camera-handler'
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

    leak({
      three,
      ...Loop,
      TextHelper,
      calculateExponentialDecayLerpRatio,
      calculateExponentialDecayLerpRatio2,
      lerp,
    })
  }, [])
  return null
}

export function Main() {
  return (
    <div className='FractalGrid'>
      <ThreeProvider>
        <div className='layer thru flex flex-col p-4 gap-2 items-start'>
          <h1 className='text-2xl'>FractalGrid</h1>
          <button
            className='border border-white px-2 py-1 rounded'
            onClick={() => CameraHandler.instances[0].mode++}>
            Switch camera
          </button>
        </div>
        <Settings />
        <FractalGrid />
      </ThreeProvider>
    </div>
  )
}