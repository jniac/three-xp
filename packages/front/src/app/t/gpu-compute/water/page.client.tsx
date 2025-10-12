'use client'

import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'
import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { onTick } from 'some-utils-ts/ticker'
import { Destroyable } from 'some-utils-ts/types'

import { leak } from '@/utils/leak'

import { FullscreenButton } from '../shared'

class WaterDemo extends Group {
  plane =
    setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), this)

  water =
    new GpuComputeWaterDemo()

  grid =
    setup(new DebugHelper(), this)
      .regularGrid({ size: 10, subdivisions: [2, 10] })
      .onTop()

  state = {
    playing: true,
    autoRotate: false,
    strength: 1,
    direction: 1,
  }

  constructor() {
    super()
    this.name = 'water-demo'

    this.plane.scale.setScalar(10)
    this.plane.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .fragment.top(glsl_ramp)
      .fragment.after('map_fragment', /* glsl */`
        vec3 data = diffuseColor.rgb;
        diffuseColor.r = clamp(data.r, 0.0, 1.0);
        diffuseColor.g = clamp(-data.r, 0.0, 1.0);

        Vec3Ramp r = ramp(0.5 + data.r * 0.1, ${vec3('#9e0202ff')}, ${vec3('#000000')}, ${vec3('#027254ff')});
        diffuseColor.rgb = mix(r.a, r.b, r.t);
      `)
  }

  *initialize(three: ThreeWebGLContext): Generator<Destroyable, this, unknown> {
    const { water } = this

    water.initialize(three.renderer)

    yield Message.on(WaterDemo, m => {
      m.setPayload(this)
    })

    let drag = false
    let time = 0

    const pointer = new Vector2(.5, .5)

    yield onTick('three', { timeInterval: 1 / 60 }, tick => {
      const { playing, autoRotate } = this.state

      if (!playing)
        return

      this.state.strength *= 0.9

      if (drag) {
        const i = three.pointer.intersectPlane('xy')
        if (i.intersected) {
          pointer.set(
            inverseLerp(-5, 5, i.point.x),
            inverseLerp(-5, 5, i.point.y))
        }
        this.state.strength = 1
      }

      if (autoRotate && !drag) {
        time += tick.deltaTime
        const radius = .3
        const angle = time * 2 * Math.PI * .4
        pointer.set(
          0.5 + Math.cos(angle) * radius,
          0.5 + Math.sin(angle) * radius)
        this.state.strength = 1
      }

      water.pointer(pointer.x, pointer.y, 40, this.state.strength * this.state.direction)
      water.update(tick.deltaTime)
      this.plane.material.map = water.currentTexture()
      this.plane.material.needsUpdate = true
    })

    yield handlePointer(three.domElement, {
      onTap: () => this.state.direction *= -1,
      onDragStart: () => drag = true,
      onDragStop: () => drag = false,
    })

    yield handleKeyboard([
      [{ key: ' ' }, () => { this.state.playing = !this.state.playing }],
    ])

    return this
  }
}

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false


    const demo = setup(new WaterDemo(), group)
    yield* demo.initialize(three)
  }, [])

  return null
}

function applyAspect<T extends { x: number, y: number } = Vector2>(aspect: number, largestSize: number, out?: T): T {
  out ??= new Vector2() as unknown as T
  if (aspect > 1) {
    out.x = largestSize
    out.y = largestSize / aspect
  } else {
    out.x = largestSize * aspect
    out.y = largestSize
  }
  return out
}

export function PageClient() {
  leak()
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 10.5,
        eventTarget: 'canvas',
      }}
    >
      <div className='layer thru flex flex-col p-12 gap-2 items-start'>
        <h1 className='text-4xl font-bold'>
          GPU Compute - Water Demo
        </h1>
        <p>
          Classic water simulation using a height map and GPU Compute.
        </p>
        <div className='flex gap-2'>
          <button
            className='px-2 py-1 border rounded bg-white/10 hover:bg-white/20 transition'
            onClick={() => {
              const demo = Message.send<WaterDemo>(WaterDemo).assertPayload()
              demo.state.playing = !demo.state.playing
            }}>
            Play / Pause [space]
          </button>
        </div>
        <div className='flex gap-2'>
          {[
            new Vector2(512, 512),
            new Vector2(256, 512),
            new Vector2(256, 128),
          ].map((size, i) => (
            <button
              key={i}
              className='px-2 py-1 border rounded bg-white/10 hover:bg-white/20 transition'
              onClick={() => {
                const demo = Message.send<WaterDemo>(WaterDemo).assertPayload()

                demo.water.setSize(size)
                const aspect = size.x / size.y
                applyAspect(aspect, 10, demo.plane.scale)

                if (aspect === 1)
                  demo.grid.clear().regularGrid({ size: 10, subdivisions: [2, 10] })

                else
                  demo.grid.clear().rect({ center: 0, size: demo.plane.scale })

              }}
            >
              {size.x}x{size.y}
            </button>
          ))}
        </div>
        <FullscreenButton />
        <FpsMeter />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
