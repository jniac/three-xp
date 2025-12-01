'use client'
import { Group } from 'three'

import { initJolt, Physics } from '@/physics/jolt'
import { ThreeInstance, ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'

import { Jolt } from '@/physics/jolt/core'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { safeColor } from 'some-utils-three/utils/make'
import { loopArray } from 'some-utils-ts/iteration/loop'
import { lerp } from 'some-utils-ts/math/basic'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { Tick } from 'some-utils-ts/ticker'

function isDev() {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost'
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.ticker.set({ inactivityWaitDurationMinimum: isDev() ? 20 : 3 * 60 })
  return null
}

class LiwaUI extends Group {
  parts = {
    spheres: [] as InstanceType<(typeof Physics)['JoltBundle']>[],
  }

  onInitialize(three: ThreeBaseContext) {
    initJolt(three).then(jolt => {

      this.parts.spheres = loopArray(16, it => {
        const radius = it.i === 0 ? 1 : 2 * RandomUtils.pick([.1, .2, .4])
        const color = RandomUtils.pick(['#fbff00ff', '#7be87bff', '#395cd0ff'])
        const autolitMaterial = new AutoLitMaterial({ color: safeColor(color) })
        return jolt.createBody({
          parent: this,
          shape: new Physics.Shape.Sphere(radius),
          position: [0, 0, 0],
          gravityFactor: 0,
          meshMaterial: autolitMaterial,
          allowedDOFs: Physics.AllowedDOF.Plane2D,
        })
      })
    })
  }

  onTick(tick: Tick) {
    for (const sphere of this.parts.spheres) {
      const p0 = sphere.body.GetCenterOfMassPosition()
      const p = new Jolt.Vec3(p0.GetX(), p0.GetY(), p0.GetZ())
      const gravityCenter = new Jolt.Vec3(0, 0, 0)
      const toCenter = gravityCenter.Sub(p)
      const length = toCenter.Length()
      if (length > 0.01) {
        sphere.body.AddForce(toCenter.Normalized().MulFloat(1000))
      }
    }
    if (this.parts.spheres.length > 0) {
      const scale = .5 * lerp(1, 3, tick.sin01Time({ frequency: 1 / 10 }))
      const newShape = new Jolt.SphereShape(scale)
      this.parts.spheres[0].bodyInterface.SetShape(this.parts.spheres[0].body.GetID(), newShape, true, Jolt.EActivation_Activate)
      this.parts.spheres[0].mesh.scale.setScalar(scale)
    }
  }
}

export function PageClient() {
  return (
    <ThreeProvider
      webgl
      vertigoControls={{
        size: 4,
        perspective: 0,
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
