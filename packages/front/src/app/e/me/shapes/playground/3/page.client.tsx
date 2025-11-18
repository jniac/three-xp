'use client'

import { ColorRepresentation, Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { fromVector3Declaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { safeColor } from 'some-utils-three/utils/make'
import { TransformProps } from 'some-utils-three/utils/transform'
import { setup } from 'some-utils-three/utils/tree'
import { Vector3Declaration } from 'some-utils-ts/declaration'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'
import { Tick } from 'some-utils-ts/ticker'

import { useState } from 'react'
import { loopArray } from 'some-utils-ts/iteration/loop'
import { lerp } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { StrokeGeometry } from '../geometries/stroke'
import { SinCurve } from '../sin-curve'

class SegmentGeometry extends PlaneGeometry {
  constructor(from: Vector3Declaration, to: Vector3Declaration, strokeWidth: number) {
    const p0 = fromVector3Declaration(from)
    const p1 = fromVector3Declaration(to)
    const length = p0.distanceTo(p1)
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x)
    super(length, strokeWidth)
    this
      .translate(length / 2, 0, 0)
      .rotateZ(angle)
      .translate(p0.x, p0.y, p0.z)
  }
}

class Spiral extends Group {
  static defaultParams = {
    mainColor: '#a02c5aff' as ColorRepresentation,
    altColor: '#5e0018ff' as ColorRepresentation,
    length: 6,
    innerLength: .4,
    innerColor: '#dfc3afff' as ColorRepresentation,
    frequency: 1 / 2,
    amplitude: .1,
    scale: 4,
    timeOffset: 0,
    phase: 0,
    x: 0,
    z: 0,
  }

  static createParts(instance: Spiral) {
    const {
      mainColor,
      altColor,
      innerColor,
      length,
      innerLength,
      frequency,
      amplitude,
      phase,
    } = instance.params

    const mainWidth = 0.25
    const altWidth = 0.05

    {
      const curve = new SinCurve({ length, frequency, amplitude, offset: 0, phase })
      const geometry = new StrokeGeometry(curve, { width: mainWidth, steps: 1000 })
      const material = new MeshBasicMaterial({ color: safeColor(mainColor) })
      material.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .fragment.after('map_fragment', /* glsl */`
          float f = sin(vUv.y * PI);
          diffuseColor.rgb *= f;
        `)
      setup(new Mesh(geometry, material), {
        parent: instance,
        name: 'main-stroke'
      })
    }

    {
      const curve = new SinCurve({ length, frequency, amplitude: -(mainWidth / 2 - amplitude) - altWidth / 2, offset: 0, phase })
      const geometry = new StrokeGeometry(curve, { width: altWidth, steps: 1000 })
      const material = new MeshBasicMaterial({ color: safeColor(altColor) })
      material.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.w += 0.5 * position.z;
        `)
        .fragment.after('map_fragment', /* glsl */`
          float f = sin(vUv.y * PI);
          f = pow(f, 4.5);
          diffuseColor.rgb *= f;
        `)
      setup(new Mesh(geometry, material), {
        parent: instance,
        name: 'alt-stroke'
      })
    }

    {
      const curve = new SinCurve({ length: innerLength, frequency, amplitude, offset: 0, phase })
      const geometry = new StrokeGeometry(curve, { width: .2, steps: 100 })
      const material = new MeshBasicMaterial({
        color: safeColor(innerColor),
      })
      material.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.w += 0.001;
        `)
      setup(new Mesh(geometry, material), {
        parent: instance,
        name: 'moving-stroke'
      })
    }

    const movingStroke = instance.getObjectByName('moving-stroke') as Mesh<StrokeGeometry<SinCurve>, MeshBasicMaterial>

    return { movingStroke }
  }

  params = { ...Spiral.defaultParams }
  parts: ReturnType<typeof Spiral.createParts>

  constructor(userParams?: Partial<typeof Spiral.defaultParams>) {
    super()
    this.setParams(userParams ?? {})
    this.parts = Spiral.createParts(this)
  }

  setParams(userParams: Partial<typeof Spiral.defaultParams>) {
    this.params = { ...this.params, ...userParams }
  }

  onTick(tick: Tick) {
    const {
      x, z,
      scale,
      length,
      innerLength,
      timeOffset,
    } = this.params

    setup(this, {
      rotation: '0, 0, 90deg',
      x,
      y: -length * scale / 2,
      z,
      scale,
    })

    const { movingStroke } = this.parts

    const delta = length - innerLength
    movingStroke.geometry.curve.params.offset = (tick.time * 0.6 + timeOffset * delta) % delta
    movingStroke.geometry.update()
  }
}

function PathStroke(props: TransformProps) {
  const [seed, setSeed] = useState(1283423)
  useGroup('path-stroke', props, function* (group) {
    yield Message.on<number>('SEED', m => setSeed(m.assertPayload()))
    setup(new Spiral(), group)
    // R.setRandom('parkmiller', seed)
    loopArray(32, () => {
      const mainColor = R.pick<ColorRepresentation>(['#ff6f91ff', '#845ec2ff', '#2806bfff', '#ff9671ff', '#ffc75fff'])
      const altColor = R.pick<ColorRepresentation>(['#004433ff', '#29006aff', '#ff9671ff', '#ffac13ff'])
      return setup(new Spiral({
        x: R.float(-1, 1) * 20,
        z: R.float(0, -25),
        scale: lerp(4, 22, R.float() ** 2),
        timeOffset: R.random(),
        phase: R.random(),
        amplitude: R.float(.05, .2),
        mainColor,
        altColor,
        innerColor: altColor,
      }), group)
    })
  }, [seed])
  return null
}

function MyScene(props: TransformProps) {
  const three = useThreeWebGL()

  useGroup('my-scene', props, function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid()
  })
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 6.5
      }}
      // className='bg-[#928bc6]'
      className='bg-[#f4b0df]'
    >
      <div className='flex flex-col gap-4 p-16'>
        <h1 className='text-2xl font-bold'>
        </h1>
      </div>

      {/* <MyScene /> */}
      <PathStroke />
    </ThreeProvider>
  )
}

