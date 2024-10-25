'use client'

import { ReactNode } from 'react'
import { Mesh, SRGBColorSpace } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { addTo } from 'some-utils-three/utils/tree'

import { hierarchyDeployAll } from 'some-three-editor/editor-context/actions'
import { EditorProvider, useEditor } from 'some-three-editor/editor-provider'

import { Leak } from '@/components/leak'
import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'

import { makeColor } from 'some-utils-three/utils/make'
import { PRNG } from 'some-utils-ts/random/prng'
import { ScatteredPlane } from './scattered-plane'
import { SkyMesh } from './SkyMesh'

export const mainColors = {
  // vividBlue: '#0046fe',
  darkBlue: '#002c52',
  orange: '#ff5c35',
  white: '#ffffff',
  lightGrey: '#c9cfd3',
}

function ScatteredDemo() {
  const editor = useEditor()

  editor.three.pipeline.basicPasses.outline.enabled = false

  useGroup('ScatteredDemo', async function* (group, three) {

    addTo(new SkyMesh(), group)
    addTo(new Mesh(new AxesGeometry(), new AutoLitMaterial()), group)

    const texture = await three.loader.load('/assets/textures/DebugTexture.png')
    texture.colorSpace = SRGBColorSpace
    const scattered = addTo(new ScatteredPlane(), group)
    scattered.internal.plane.material.map = texture
    scattered.internal.plane.material.mapAspect = texture.image.width / texture.image.height

    const d0 = scattered.getDistribution({ seed: 4789, position: [-2, 0], size: [2, 3] })
    const d1 = scattered.getDistribution({ seed: 3249, position: [2, 0], size: [2, 4] })
    scattered.drawDistribution(d0)
    scattered.drawDistribution(d1)

    group.userData.transition = 0
    group.userData.transition_meta = 'Slider(0, 1, step: 0.01)'

    group.userData.scale = 1
    group.userData.scale_meta = 'Slider(-1, 1, pow: 10, step: .1)'

    group.userData.links = [scattered.internal.plane.material.userData]

    const colorArray = Object.values(mainColors)
    for (let i = 0, count = scattered.count; i < count; i++) {
      scattered.internal.plane.setColorAt(i, makeColor(PRNG.pick(colorArray)))
    }

    yield three.onTick(() => {
      scattered.lerpDistribute(d0, d1, group.userData.transition)
      scattered.scale.setScalar(group.userData.scale)
    })

    hierarchyDeployAll(editor, group)
    editor.sceneSelection.add('Select ScatteredDemo', group)

  }, [])

  return null
}

function OrbitControls() {
  useThree(function* (three) {
    three.useOrbitControls({
      position: [-2, 0, 8],
      target: [-2, 0, 0],
    })
  }, [])
  return null
}

export function EditorProviderWithThree({ children }: { children?: ReactNode }) {
  const three = useThree()
  return (
    <EditorProvider
      three={three}
      backgroundColor='#26163c4f'
    >
      {children}
    </EditorProvider>
  )
}

export function Client() {
  return (
    <div className='layer thru'>
      <Leak />
      <ThreeProvider>
        <EditorProviderWithThree>
          <div className='layer thru px-3 py-2 flex flex-col gap-4'>
            <h1 className='text-4xl'>ScatteredPlane</h1>
          </div>
          <OrbitControls />
          <ScatteredDemo />
        </EditorProviderWithThree>
      </ThreeProvider>
    </div >
  )
}