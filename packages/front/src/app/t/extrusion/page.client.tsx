'use client'


import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { setup } from 'some-utils-three/utils/tree'

import { extrudeShapeAlongPath } from './extrusion'

import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { BufferAttribute, BufferGeometry, Mesh, PlaneGeometry, TorusKnotGeometry } from 'three'
import { Vector2 } from 'three/src/math/Vector2.js'
import { DebugTexture } from './debug'
import s from './page.client.module.css'

function MyScene() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false

  useGroup('my-scene', function* (group) {
    setup(new SimpleGridHelper({ size: 8 }), group)
    setup(new Mesh(new TorusKnotGeometry(1, .5, 256, 64), new AutoLitMaterial({ map: new DebugTexture() })), { parent: group, x: -2 })

    setup(new Mesh(new PlaneGeometry(), new AutoLitMaterial({
      map: new DebugTexture(),
    }),), { parent: group, x: 2 })

    const SHAPE_RESOLUTION = 12
    const result = extrudeShapeAlongPath({
      shape: function* () {
        for (let i = 0; i < SHAPE_RESOLUTION; i++) {
          const angle = (i / SHAPE_RESOLUTION) * Math.PI * 2
          const x = Math.cos(angle) * 0.5 + 0.5
          const y = Math.sin(angle) * 0.5 + 0.5
          yield new Vector2(x, y)
        }
      },
      shapeLength: SHAPE_RESOLUTION,
      shapeIsClosed: true,

      path: function* () {
        yield makeMatrix4({})
        yield makeMatrix4({ z: 2, rotationY: Math.PI / 4 })
        yield makeMatrix4({ x: 2, z: 2, rotationY: Math.PI / 2 })
      },
      pathLength: 3,
      pathIsClosed: false,
    })

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(result.position, 3))
    geometry.setAttribute('normal', new BufferAttribute(result.normal, 3))
    geometry.setAttribute('uv', new BufferAttribute(result.uv, 2))
    geometry.setIndex(new BufferAttribute(result.index, 1))

    setup(new Mesh(geometry, new AutoLitMaterial({
      map: new DebugTexture(),
      side: 2,
    })), group)

    const helper = setup(new DebugHelper(), group)
    helper.debugGeometry(geometry)
  }, [])

  return null
}

function UI() {
  return (
    <div className={`layer thru ${s.Client} p-8 flex flex-col gap-1 items-start`}>
      <h1 className='text-2xl font-bold mb-4'>
        Extrusion Demo
      </h1>
      <button
        className='btn border rounded px-2 py-1'
        onClick={() => {
          alert('Action')
        }}
      >
        Action
      </button>
      <button
        className='btn border rounded px-2 py-1'
        onClick={() => {
          alert('Another Action')
        }}
      >
        Another Action
      </button>
    </div>
  )
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 9,
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
