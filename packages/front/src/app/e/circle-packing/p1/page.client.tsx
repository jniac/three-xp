'use client'
import { Group } from 'three'

import { ThreeInstance, ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { safeColor } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { loopArray } from 'some-utils-ts/iteration/loop'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'
import { Tick } from 'some-utils-ts/ticker'

import { initJolt, PhysicBundle, Physics } from '@/physics/jolt'
import { Jolt } from '@/physics/jolt/core'
import { handlePointer } from 'some-utils-dom/handle/pointer'

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

class Item {
  #scale = 1
  get scale() { return this.#scale }
  set scale(value: number) {
    if (this.#scale !== value) {
      this.#scale = value
      this.bundle.mesh.scale.setScalar(value)
      const newShape = new Jolt.SphereShape(.5 * this.scale)
      this.bundle.bodyInterface.SetShape(this.bundle.body.GetID(), newShape, true, Jolt.EActivation_Activate)
    }
  }
  constructor(public bundle: PhysicBundle, public index: number) { }
}

class LiwaUI extends Group {
  parts = {
    items: [] as Item[],
    debugHelper: setup(new DebugHelper(), this)
      .circle({ radius: GRAVITY_FADE_IN, quality: 'ultra' })
  };

  *onInitialize(three: ThreeBaseContext) {
    initJolt(three).then(jolt => {
      R.setRandom('parkmiller', 'circle-packing')
      this.parts.items = loopArray(32, it => {
        const color = R.pick(['#fbff00ff', '#7be87bff', '#395cd0ff'])
        const autolitMaterial = new AutoLitMaterial({ color: safeColor(color) })
        const r = 5
        const a = it.t * Math.PI * 2
        const x = r * Math.cos(a)
        const y = r * Math.sin(a)
        const bundle = jolt.createBody({
          parent: this,
          shape: new Physics.Shape.Sphere(.5),
          position: [x, y, 0],
          gravityFactor: 0,
          meshMaterial: autolitMaterial,
          allowedDOFs: Physics.AllowedDOF.Plane2D,
          linearDamping: 10,
          numPositionStepsOverride: 40,
        })
        const item = new Item(bundle, it.i)
        item.scale = R.pick([.25, .5, 1, 2])
        return item
      })

      Object.assign(window, { liwa: this })
    })

    yield handlePointer(three.domElement, {
      onTap: () => {
        const [I] = three.pointer.raycast(this)
        if (I) {
          const item = this.parts.items.find(it => it.bundle.mesh === I.object)!
          item.scale += .1
        }
      },
    })
  }

  onTick(tick: Tick) {
    for (const [, item] of this.parts.items.entries()) {
      const { bundle } = item
      const p0 = bundle.body.GetCenterOfMassPosition()
      const p = new Jolt.Vec3(p0.GetX(), p0.GetY(), p0.GetZ())
      const gravityCenter = new Jolt.Vec3(0, 0, 0)
      const toCenter = gravityCenter.Sub(p)
      const length = toCenter.Length()
      if (length > 0.01) {
        const imass = bundle.body.GetMotionProperties().GetInverseMass()
        const fadeIn = Math.min(length / GRAVITY_FADE_IN, 1)
        // sphere.body.AddForce(toCenter.Normalized().MulFloat(1000))
        bundle.body.AddImpulse(toCenter.Normalized().MulFloat(fadeIn / imass))
      }
    }
  }
}

export function PageClient() {
  return (
    <ThreeProvider
      webgl
      vertigoControls={{
        fixed: true,
        size: 4,
        perspective: .1,
      }}
    >
      <ThreeSettings />
      <ThreeInstance value={LiwaUI} />
      <div className='layer thru p-16'>
        <h1 className='text-4xl font-bold'>
          Circle Packing P1
        </h1>
      </div>
    </ThreeProvider>
  )
}
