'use client'

import { ThreeProvider, useGroup, useThreeWebGPU } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Mesh, PlaneGeometry, TorusKnotGeometry } from 'three'
import { screenUV, viewportSharedTexture } from 'three/tsl'
import { MeshBasicNodeMaterial, MeshNormalNodeMaterial } from 'three/webgpu'

export function MyScene() {
  const three = useThreeWebGPU()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    setup(new Mesh(new TorusKnotGeometry(1, .45, 256, 32), new MeshNormalNodeMaterial()), {
      parent: group,
      position: [0, 0, -4],
    })

    // const text = setup(new TextHelper({ nodeMaterial: true }), group)
    // text.setTextAt(0, 'Hello World?', {
    //   position: [0, 0, 0],
    //   color: 'white',
    // })

    {
      const material = new MeshBasicNodeMaterial()
      material.colorNode = viewportSharedTexture(screenUV).rgb.oneMinus()
      material.transparent = true
      setup(new Mesh(new PlaneGeometry(), material), group)
    }

  }, 'always')
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      webgpu
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}