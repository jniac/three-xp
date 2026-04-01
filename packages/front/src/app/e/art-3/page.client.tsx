'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { setup } from 'some-utils-three/utils/tree'
import { AlwaysStencilFunc, Color, ConeGeometry, EqualStencilFunc, Mesh, MeshBasicMaterial, PlaneGeometry, ReplaceStencilOp } from 'three'

function Art() {
  const three = useThreeWebGL()
  three.scene.background = new Color('#ddd')
  three.renderer.localClippingEnabled = true

  useGroup('art', function* (group) {
    setup(new DebugHelper(), group)
      .rect({ center: 0, extent: .5 }, { color: 'red' })

    const mask = setup(new Mesh(
      new PlaneGeometry(),
      new MeshBasicMaterial({
        color: 'white',
        stencilRef: 1,
        stencilFunc: AlwaysStencilFunc,
        stencilZPass: ReplaceStencilOp,
        stencilWrite: true,
        depthWrite: false,
        colorWrite: false,
      }),
    ), {
      name: 'mask',
      parent: group,
      userData: { isMask: true },
      renderOrder: -1,
    })

    const blade = setup(new Mesh(
      new ConeGeometry(),
      new MeshBasicMaterial({
        map: new DebugTexture(),
        stencilRef: 1,
        stencilWrite: true,
        stencilFunc: EqualStencilFunc,
      }),
    ), {
      parent: group,
      z: -2,
    })
  }, [])
  return null
}

export function PageClient() {
  return (
    <div className='absolute-through'>
      <ThreeProvider
        stencil
        vertigoControls={{
          size: 3,
          rotation: '-10deg, -15deg, 0',
        }}
      >
        <div className='text-[#333] p-4'>
          <h1>
            Stencil Test (WIP)
          </h1>
        </div>
        <Art />
      </ThreeProvider>
    </div>
  )
}