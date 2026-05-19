'use client'

import { BufferGeometry, ConeGeometry, CylinderGeometry, InstancedMesh } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setVertexColors } from 'some-utils-three/utils/geometry/vertex-colors'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

import { leak } from '@/utils/leak'

import { VertigoWidget } from '../general/VertigoWidget'

class PineGeometry extends BufferGeometry {
  constructor() {
    super()
    const cone1 = setVertexColors(
      new ConeGeometry(1.5, 2, 32, 1, true).translate(0, 3.75, 0),
      '#369674')
    const cone2 = setVertexColors(
      new ConeGeometry(1.85, 2.35, 32, 1, true).translate(0, 3.05, 0),
      '#29795d')
    const cone3 = setVertexColors(
      new ConeGeometry(2, 3, 32, 1, true).translate(0, 2.5, 0),
      '#1a5842')
    const trunk = setVertexColors(
      new CylinderGeometry(0.25, 0.5, 3, 32).translate(0, 1.5, 0),
      '#8b5a2b')

    const master = BufferGeometryUtils.mergeGeometries([
      cone1,
      cone2,
      cone3,
      trunk,
    ])

    this.setAttribute('position', master.attributes.position)
    this.setAttribute('normal', master.attributes.normal)
    this.setAttribute('color', master.attributes.color)
    this.setIndex(master.index)
  }
}

class Forest extends InstancedMesh {
  constructor(pineCount = 200) {
    super(
      new PineGeometry(),
      new AutoLitMaterial({ vertexColors: true, side: 2 }),
      pineCount)

    R.setRandom('parkmiller')

    for (let i = 0; i < pineCount; i++) {
      this.setMatrixAt(i, makeMatrix4({
        x: R.number(-50, 50),
        z: R.number(-50, 50),
        scale: 2 ** R.number(-1, 0),
      }))
    }
  }
}

function MyScene() {
  useGroup('my-scene', function* (group, three) {
    setup(new Forest(100), group)

    setup(new DebugHelper(), { parent: group })
      .regularGrid({ plane: 'xz' })

    const widget = setup(new VertigoWidget(), { parent: group })

    yield three.ticker.onTick(tick => {
      widget.widgetUpdate(
        three.pointer.screenPosition,
        three.pointer.buttonDown(),
        three.camera,
        tick.deltaTime,
      )
    })
  }, [])
  return null
}

export function PageClient() {
  leak()
  return (
    <ThreeProvider
      vertigoControls={{
        size: 50,
        rotation: '-30deg, 45deg, 0',
      }}
    >
      <div className={`layer thru p-4`}>
        <h1>Vertigo Widget</h1>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
