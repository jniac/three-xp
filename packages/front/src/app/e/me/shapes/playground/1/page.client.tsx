'use client'

import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { TransformProps } from 'some-utils-three/utils/transform'
import { setup } from 'some-utils-three/utils/tree'

import { fromVector3Declaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { Vector3Declaration } from 'some-utils-ts/declaration'
import { Tick } from 'some-utils-ts/ticker'
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
  parts = (() => {
    const length = 2
    const period = length * 1.5
    const curve = new SinCurve({ length, period, amplitude: .2, offset: 0 })
    const geometry1 = new StrokeGeometry(curve, { width: .5, steps: 1000 })
    const material1 = new MeshBasicMaterial({})
    material1.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .fragment.after('map_fragment', /* glsl */`
        float f = cos(vUv.x * 3.14159 * 2.0 * ${period.toFixed(1)}) * 0.5 + 0.5;
        diffuseColor.rgb = mix(${vec3('#4f1388ff')}, ${vec3('#ffb1cfff')}, f);
      `)
    const mesh1 = setup(new Mesh(geometry1, material1), this)
    // mesh1.visible = false

    const geometry2 = new SegmentGeometry(0, [length, 0, 0], .05)
    const material2 = new MeshBasicMaterial({ color: '#1d1409' })
    const mesh2 = setup(new Mesh(geometry2, material2), this)

    {
      const geometry3 = new StrokeGeometry(
        new SinCurve({ length, period, amplitude: .2, offset: 0 }),
        { width: .01, steps: 1000 })
      const material3 = new MeshBasicMaterial({})
      material3.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.z += -0.05;
        `)
        .fragment.after('map_fragment', /* glsl */`
          float f = cos(vUv.x * 3.14159 * 2.0 * ${period.toFixed(1)}) * 0.5 + 0.5;
          diffuseColor.rgb = mix(${vec3('#131d88ff')}, ${vec3('#fbffb1ff')}, f);
        `)
      setup(new Mesh(geometry3, material3), {
        parent: this,
        name: 'inner-stroke'
      })
    }

    {
      const geometry3 = new StrokeGeometry(
        new SinCurve({ length, period, amplitude: .2, offset: 0 }),
        { width: [.3, .3], steps: 1000 })
      const material3 = new MeshBasicMaterial({})
      material3.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.z += 0.05;
        `)
        .fragment.after('map_fragment', /* glsl */`
          float f = cos(vUv.x * 3.14159 * 2.0 * ${period.toFixed(1)}) * 0.5 + 0.5;
          diffuseColor.rgb = mix(${vec3('#003d49ff')}, ${vec3('#100076ff')}, f);
        `)
      setup(new Mesh(geometry3, material3), {
        parent: this,
        name: 'outer-stroke-1'
      })
    }

    {
      const geometry3 = new StrokeGeometry(
        new SinCurve({ length, period, amplitude: .2, offset: 0 }),
        { width: .7, steps: 1000 })
      const material3 = new MeshBasicMaterial({})
      material3.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.z += 0.1;
        `)
        .fragment.after('map_fragment', /* glsl */`
          float f = cos(vUv.x * 3.14159 * 2.0 * ${period.toFixed(1)}) * 0.5 + 0.5;
          diffuseColor.rgb = mix(${vec3('#fbffb1ff')}, ${vec3('#4f1388ff')}, f);
        `)
      setup(new Mesh(geometry3, material3), {
        parent: this,
        name: 'outer-stroke-2'
      })
    }

    return { mesh1, mesh2, curve, geometry1, geometry2 }
  })()

  onTick(tick: Tick) {

  }
}

function PathStroke(props: TransformProps) {
  useGroup('path-stroke', props, function* (group) {
    setup(new Spiral(), {
      parent: group,
      y: -4,
      rotationZ: '90deg',
      scale: 4,
    })
  }, [])
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
        size: 5.5
      }}
      // className='bg-[#928bc6]'
      className='bg-[#8bc6bc]'
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

