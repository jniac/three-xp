'use client'
import { Group } from 'three'

import { initJolt, Physics } from '@/physics/jolt'
import { ThreeInstance, ThreeProvider } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'

import { Jolt } from '@/physics/jolt/core'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { loopArray } from 'some-utils-ts/iteration/loop'
import { lerp } from 'some-utils-ts/math/basic'
import { Tick } from 'some-utils-ts/ticker'

function ThreeSettings() {
  return null
}

class LiwaUI extends Group {
  parts = {
    spheres: [] as InstanceType<(typeof Physics)['JoltBundle']>[],
  }

  onInitialize(three: ThreeBaseContext) {
    initJolt(three).then(jolt => {
      const autolitMaterial = new AutoLitMaterial()
      const b = jolt.createBody({
        parent: this,
        position: [-.3, 0, 0],
        gravityFactor: 0,
        restitution: 1,
      })
      b.mesh.material = new AutoLitMaterial({ color: 'yellow' })
      console.log(b.body)
      Object.assign(window, { b })

      const box2 = (x = 0, y = 0, width = 1, height = 1, options?: Partial<Parameters<typeof jolt.createBody>[0]>) => {
        jolt.createBody({
          ...options,
          parent: this,
          position: [x + width / 2, y + height / 2, 0],
          shape: new Physics.Shape.Box([width / 2, height / 2, .1]),
          type: Physics.MotionType.KINEMATIC,
        }).mesh.material = autolitMaterial
      }

      box2(-2, -2, 8, 1, { restitution: .9 })

      jolt.createBody({
        parent: this,
        position: [.1, -2, 0],
        type: Physics.MotionType.KINEMATIC,
      }).mesh.material = autolitMaterial
      jolt.createBody({
        parent: this,
        position: [-.9, -2, -.1],
        type: Physics.MotionType.KINEMATIC,
      }).mesh.material = autolitMaterial
      jolt.createBody({
        parent: this,
        position: [-.5, -2, 1],
        type: Physics.MotionType.KINEMATIC,
      }).mesh.material = autolitMaterial

      jolt.createBody({
        parent: this,
        shape: new Physics.Shape.Box([.5, .5, .01]),
        allowedDOFs: Physics.AllowedDOF.Plane2D,
        position: [.15, 3, 0],
        inertiaMultiplier: 100,
      })

      this.parts.spheres = loopArray(10, () => {
        return jolt.createBody({
          parent: this,
          shape: new Physics.Shape.Sphere(.2),
          position: [1, 0, 0],
          gravityFactor: 0,
          meshMaterial: autolitMaterial,
        })
      })
    })
  }

  onTick(tick: Tick) {
    for (const sphere of this.parts.spheres) {
      const p0 = sphere.body.GetCenterOfMassPosition()
      const p = new Jolt.Vec3(p0.GetX(), p0.GetY(), p0.GetZ())
      const gravityCenter = new Jolt.Vec3(1, 0, 0)
      const toCenter = gravityCenter.Sub(p)
      const length = toCenter.Length()
      if (length > 0.01) {
        sphere.body.AddForce(toCenter.Normalized().MulFloat(100))
      }
    }
    if (this.parts.spheres.length > 0) {
      const scale = lerp(1, 3, tick.sin01Time({ frequency: 1 / 10 }))
      const newShape = new Jolt.SphereShape(.2 * scale)
      this.parts.spheres[0].bodyInterface.SetShape(this.parts.spheres[0].body.GetID(), newShape, true, Jolt.EActivation_Activate)
      this.parts.spheres[0].mesh.scale.setScalar(scale)
      // @ts-ignore
      console.log(this.parts.spheres[0].body.SetShape)
    }
  }
}

export function PageClient() {
  return (
    <ThreeProvider
      webgl
      vertigoControls={{
        size: 4,
      }}
    >
      <ThreeSettings />
      <ThreeInstance value={LiwaUI} />
      <h1>
        Liwa UI
      </h1>
    </ThreeProvider>
  )
}
