'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { setup } from 'some-utils-three/utils/tree'
import { AlwaysStencilFunc, CapsuleGeometry, CircleGeometry, Color, EqualStencilFunc, Mesh, MeshBasicMaterial, Plane, PlaneGeometry, ReplaceStencilOp, Vector3 } from 'three'

function Art() {
  const three = useThreeWebGL()
  three.scene.background = new Color('#ddd')
  three.renderer.localClippingEnabled = true

  useGroup('art', function* (group) {
    setup(new DebugHelper(), group)
      .rect({ center: 0, extent: 1 }, { color: 'red' })

    const mask = setup(new Mesh(
      new CircleGeometry(1, 128),
      new MeshBasicMaterial({
        color: 'white',
        // map: new DebugTexture(),
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
      x: 1,
      z: .1,
      renderOrder: 0,
    })
    setup(new DebugHelper(), mask).circle({ center: 0, radius: 1, quality: 'ultra' }, { color: 'blue' })

    const blade = setup(new Mesh(
      new PlaneGeometry(1, 1),
      new MeshBasicMaterial({
        map: new DebugTexture(),
        stencilRef: 1,
        stencilWrite: true,
        stencilFunc: EqualStencilFunc,
      }),
    ), {
      parent: group,
      renderOrder: 1,
    })

    {
      const front = setup(new Mesh(
        new CapsuleGeometry(.5, 5, 8, 32, 4),
        new AutoLitMaterial({
          side: 2,
          clippingPlanes: [new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), mask.position)],
        })
      ), {
        parent: group,
        rotation: '90deg, 0, 0,',
        x: 1,
      })
      const back = setup(new Mesh(
        new CapsuleGeometry(.5, 5, 8, 32, 4),
        new AutoLitMaterial({
          stencilRef: 1,
          stencilWrite: true,
          stencilFunc: EqualStencilFunc,
          stencilZPass: ReplaceStencilOp,
          stencilZFail: ReplaceStencilOp,
        })
      ), {
        parent: group,
        rotation: '90deg, 0, 0,',
        x: 1,
      })
    }
  }, [])
  return null
}

export function Main() {
  return (
    <div className='absolute-through'>
      <ThreeProvider
        stencil
        vertigoControls={{
          size: 6,
          rotation: '-20deg, -35deg, 0',
        }}
      >
        <Art />
      </ThreeProvider>
    </div>
  )
}