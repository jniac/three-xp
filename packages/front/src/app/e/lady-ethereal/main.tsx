'use client'

import { Group } from 'three'
import { uv, vec2, vec3 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

import { ThreeInstance, ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/types'
import { LineHelper } from 'some-utils-three/helpers/line'
import { autoLit } from 'some-utils-three/tsl/utils'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'

import { initJolt, Physics } from '@/physics/jolt'

class Widget1 extends Group {
  parts = (() => {
    const line = setup(new LineHelper(), this)
      .rectangle([1, 1])

    const p = .05, l = .2

    line.line([p, .5], [.5 - .2, .5])
    line.line([1 - p, .5], [.5 + .2, .5])

    line.polyline([
      [.5 - .1, p],
      [.5 + .1, p],
    ])

    line.polyline([
      [.5 - .1, 1 - p],
      [.5 + .1, 1 - p],
    ])

    for (const it of loop(10)) {
      const x = p + l * it.p
      line.line([x, p], [x, p + l])
      line.line([x, 1 - (p + l)], [x, 1 - p])
      line.line([1 - x, p], [1 - x, p + l])
      line.line([1 - x, 1 - (p + l)], [1 - x, 1 - p])
    }

    line.circle([.5, .5], .2)
    line.circle([.5, .5], .22)

    const cd = .17
    line.capsule2([.5 + cd, .5 + cd], [.5 - cd, .5 - cd], .05)
    line.capsule2([.5 + cd, .5 - cd], [.5 - cd, .5 + cd], .05)

    line.cross([.5, .5], .05)

    line.draw()

    return { line }
  })()

  onDestroy() {

  }
}

class MainGroup extends Group {
  parts = (() => {
    const line = setup(new LineHelper(), this)
      .grid2({ size: 4 })
      .opacity(.05)
      .draw()

    setup(new Widget1(), this)
    setup(new Widget1(), {
      parent: this,
      position: [1, 0, 0]
    })

    return { line }
  })()

  onInitialize(three: ThreeBaseContext) {
    initJolt(three).then(jolt => {
      const b = jolt.createBody({
        parent: this,
        position: [-.3, 0, 0],
      })
      b.mesh.material = new MeshBasicNodeMaterial({
        colorNode: autoLit().mul(vec3(uv().mul(vec2(15, 10)).fract(), 1)),
      })

      const box2 = (x = 0, y = 0, width = 1, height = 1) => {
        jolt.createBody({
          parent: this,
          position: [x + width / 2, y + height / 2, 0],
          shape: new Physics.Shape.Box([width / 2, height / 2, .1]),
          type: Physics.MotionType.KINEMATIC,
        }).mesh.material = b.mesh.material
      }

      box2(-2, -2, 8, 1)

      jolt.createBody({
        parent: this,
        position: [.1, -2, 0],
        type: Physics.MotionType.KINEMATIC,
      }).mesh.material = b.mesh.material
      jolt.createBody({
        parent: this,
        position: [-.9, -2, -.1],
        type: Physics.MotionType.KINEMATIC,
      }).mesh.material = b.mesh.material
      jolt.createBody({
        parent: this,
        position: [-.5, -2, 1],
        type: Physics.MotionType.KINEMATIC,
      }).mesh.material = b.mesh.material

      jolt.createBody({
        shape: new Physics.Shape.Box([.5, .5, .01]),
        allowedDOFs: Physics.AllowedDOF.Plane2D,
        position: [.15, 3, 0],
        parent: this,
      })
    })
  }
}

function Settings() {
  useThreeWebGL(function* (three) {
    three.pipeline.basicPasses.fxaa.enabled = false
  }, [])
  return null
}

export function Main() {
  return (
    <ThreeProvider webgpu vertigoControls={{ size: 5 }}>
      <div className='Main layer thru flex flex-col items-start justify-start p-4'>
        <h1>Chunk Viewer</h1>
        <ThreeInstance
          // @ts-ignore
          value={MainGroup} />
        <Settings />
      </div>
    </ThreeProvider>
  )
}
