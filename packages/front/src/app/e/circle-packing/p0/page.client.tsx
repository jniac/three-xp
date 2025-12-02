'use client'
import { Group } from 'three'

import { ThreeInstance, ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { safeColor } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { loopArray } from 'some-utils-ts/iteration/loop'
import { lerp } from 'some-utils-ts/math/basic'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { Tick } from 'some-utils-ts/ticker'

import { initJolt, PhysicBundle, Physics } from '@/physics/jolt'
import { Jolt } from '@/physics/jolt/core'

function isDev() {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost'
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false
  three.ticker.set({ inactivityWaitDurationMinimum: isDev() ? 20 : 3 * 60 })
  return null
}

const GRAVITY_FADE_IN = 1.5

class LiwaUI extends Group {
  parts = {
    spheres: [] as PhysicBundle[],
    debugHelper: setup(new DebugHelper(), this)
      .circle({ radius: GRAVITY_FADE_IN, quality: 'ultra' })
  }

  onInitialize(three: ThreeBaseContext) {
    initJolt(three).then(jolt => {
      this.parts.spheres = loopArray(32, it => {
        const color = RandomUtils.pick(['#fbff00ff', '#7be87bff', '#395cd0ff'])
        const autolitMaterial = new AutoLitMaterial({ color: safeColor(color) })
        const r = 5
        const a = it.t * Math.PI * 2
        const x = r * Math.cos(a)
        const y = r * Math.sin(a)
        return jolt.createBody({
          parent: this,
          shape: new Physics.Shape.Sphere(.5),
          position: [x, y, 0],
          gravityFactor: 0,
          meshMaterial: autolitMaterial,
          allowedDOFs: Physics.AllowedDOF.Plane2D,
          linearDamping: 10,
          numPositionStepsOverride: 40,
        })
      })

      Object.assign(window, { liwa: this })
    })
  }

  onTick(tick: Tick) {
    for (const [sphereIndex, sphere] of this.parts.spheres.entries()) {
      const p0 = sphere.body.GetCenterOfMassPosition()
      const p = new Jolt.Vec3(p0.GetX(), p0.GetY(), p0.GetZ())
      const gravityCenter = new Jolt.Vec3(0, 0, 0)
      const toCenter = gravityCenter.Sub(p)
      const length = toCenter.Length()
      if (length > 0.01) {
        const imass = sphere.body.GetMotionProperties().GetInverseMass()
        const fadeIn = Math.min(length / GRAVITY_FADE_IN, 1)
        // sphere.body.AddForce(toCenter.Normalized().MulFloat(1000))
        sphere.body.AddImpulse(toCenter.Normalized().MulFloat(fadeIn / imass))
      }
      if (sphereIndex % 4 === 0) {
        const scale = lerp(1, 3, tick.sin01Time({ frequency: 1 / 10, phase: sphereIndex / 4 }))
        const newShape = new Jolt.SphereShape(.5 * scale)
        sphere.bodyInterface.SetShape(sphere.body.GetID(), newShape, true, Jolt.EActivation_Activate)
        sphere.mesh.scale.setScalar(scale)
      }
    }
  }
}

export function PageClient() {
  return (
    <ThreeProvider
      webgl
      vertigoControls={{
        size: 4,
        perspective: .1,
      }}
    >
      <ThreeSettings />
      <ThreeInstance value={LiwaUI} />
      <div className='layer thru p-16'>
        <h1 className='text-4xl font-bold'>
          Circle Packing
        </h1>
      </div>
    </ThreeProvider>
  )
}
