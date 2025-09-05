'use client'

import { BufferGeometry, ColorRepresentation, Euler, Group, LineBasicMaterial, LineSegments, Mesh, TorusKnotGeometry, Vector3 } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Message } from 'some-utils-ts/message'
import { composeMatrixWithShear, decomposeMatrixWithShear, testRoundTrip } from './matrix-with-shear'
import s from './page.client.module.css'

class MyObject extends Group {
  static shared = {
    torusKnotGeometry: new TorusKnotGeometry(.15, .07, 256, 64),
    axesGeometry: new AxesGeometry(),
    cubeGeometry: new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 0),
      new Vector3(1, 1, 0),
      new Vector3(1, 1, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 0),

      new Vector3(0, 0, 1),
      new Vector3(1, 0, 1),
      new Vector3(1, 0, 1),
      new Vector3(1, 1, 1),
      new Vector3(1, 1, 1),
      new Vector3(0, 1, 1),
      new Vector3(0, 1, 1),
      new Vector3(0, 0, 1),

      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 1),
      new Vector3(1, 1, 0),
      new Vector3(1, 1, 1),
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 1),
    ]),
    autoLitVertexColorsMaterial: new AutoLitMaterial({ vertexColors: true }),
  }
  constructor(color: ColorRepresentation = 'white') {
    super()
    const {
      torusKnotGeometry,
      axesGeometry,
      autoLitVertexColorsMaterial,
      cubeGeometry,
    } = MyObject.shared
    setup(new Mesh(torusKnotGeometry, new AutoLitMaterial({ color })), this)
    setup(new Mesh(axesGeometry, autoLitVertexColorsMaterial), this)
    setup(new LineSegments(cubeGeometry, new LineBasicMaterial({ color })), this)
  }
}

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new MyObject(), group)
    setup(new SimpleGridHelper({ size: 8 }), group)
    setup(new SimpleGridHelper({ size: 8 }), {
      parent: group,
      position: [0, 0, 3],
    })

    const objA = setup(new MyObject(), group)
    objA.matrixAutoUpdate = false
    composeMatrixWithShear({
      position: new Vector3(2, 1, 0),
      // rotation: objA.quaternion.setFromEuler(new Euler(0, -Math.PI / 2, Math.PI / 8)),
      rotation: objA.quaternion.setFromEuler(new Euler(0, 0, 0)),
      // scale: new Vector3(1, 1, 1),
      scale: new Vector3(1, 2, 3),
      // shear: { xy: 0, xz: 0, yz: 0 },
      shear: { xy: 1, xz: -1, yz: 1 },
      // shear: { xy: .5, xz: .2, yz: .1 },
    }, objA.matrix)

    const decomposed = decomposeMatrixWithShear(objA.matrix)
    console.log('decomposed:', decomposed)
    console.log(new Euler().setFromQuaternion(decomposed.rotation))

    const group2 = setup(new Group(), {
      parent: group,
      position: [0, -2, 0],
    })
    const objB = setup(new MyObject('red'), group2)
    objB.matrixAutoUpdate = false
    composeMatrixWithShear(decomposed, objB.matrix)

    console.log('round trip:', testRoundTrip(objA.matrix))
  }, [])
  return null
}

function UI() {
  return (
    <div className={`${s.Client} ui layer thru p-8 flex flex-col gap-1 items-start`}>
      <h1 className='text-2xl font-bold mb-4'>
        Matrix with Shear
      </h1>
      <button
        className='btn border rounded px-4 py-2'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 0,
            zoom: 1,
            rotation: [0, 0, 0],
          })
        }}
      >
        Orthographic (reset)
      </button>
      <button
        className='btn border rounded px-4 py-2'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 1,
          })
        }}
      >
        Perspective
      </button>
    </div>
  )
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 8,
        perspective: 0,
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
