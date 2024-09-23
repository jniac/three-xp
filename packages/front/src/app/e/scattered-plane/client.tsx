'use client'

import { ReactNode } from 'react'
import { Mesh, SRGBColorSpace } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { addTo } from 'some-utils-three/utils/parenting'

import { hierarchyDeployAll } from 'some-three-editor/editor-context/actions'
import { EditorProvider, useEditor } from 'some-three-editor/editor-provider'

import { Leak } from '@/components/leak'
import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'

import { ScatteredPlane } from './scattered-plane'
import { SkyMesh } from './SkyMesh'

function ScatteredDemo() {
  const editor = useEditor()

  useGroup('ScatteredDemo', async function* (group, three) {

    addTo(new SkyMesh(), group)
    addTo(new Mesh(new AxesGeometry(), new AutoLitMaterial()), group)

    const texture = await three.loader.load('/images/DebugTexture.png')
    texture.colorSpace = SRGBColorSpace
    const plane = addTo(new ScatteredPlane(), group)
    plane.internal.plane.material.map = texture
    plane.internal.plane.material.mapAspect = texture.image.width / texture.image.height

    const d0 = plane.getDistribution({ position: [-2, 0], size: [3, 2] })
    const d1 = plane.getDistribution({ position: [2, 0], size: [2, 3] })
    plane.drawDistribution(d0)
    plane.drawDistribution(d1)

    group.userData.transition = 0
    group.userData.transition_meta = 'Slider(0, 1, step: 0.01)'

    group.userData.foo = 0
    group.userData.foo_meta = 'Slider(-2, 2, step: 0.25)'

    group.userData.scale = 1
    group.userData.scale_meta = 'Slider(-1, 1, pow: 10, step: .1)'

    yield three.onTick(() => {
      plane.lerpDistribute(d0, d1, group.userData.transition)
      plane.rotation.z = group.userData.foo * Math.PI
      plane.scale.setScalar(group.userData.scale)
    })

    hierarchyDeployAll(editor, group)
    editor.sceneSelection.add('Select ScatteredDemo', group)

  }, [])

  return null
}

function OrbitControls() {
  useThree(function* (three) {
    three.useOrbitControls({
      position: [0, 0, 8],
      target: 0,
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
    <div className='absolute-through'>
      <Leak />
      <ThreeProvider>
        <EditorProviderWithThree>
          <div className='absolute-through px-3 py-2 flex flex-col gap-4'>
            <h1 className='text-4xl'>ScatteredPlane</h1>
          </div>
          <OrbitControls />
          <ScatteredDemo />
        </EditorProviderWithThree>
      </ThreeProvider>
    </div >
  )
}