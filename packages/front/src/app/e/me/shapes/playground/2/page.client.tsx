'use client'

import { BufferGeometry, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { TransformProps } from 'some-utils-three/utils/transform'
import { setup } from 'some-utils-three/utils/tree'

import { fromVector3Declaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setVertexColors } from 'some-utils-three/utils/geometry/vertex-colors'
import { Vector3Declaration } from 'some-utils-ts/declaration'
import { Tick } from 'some-utils-ts/ticker'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'
import { StrokeGeometry } from '../geometries/stroke'
import { SinCurveOld } from '../sin-curve'

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
    const length = 3
    const period = length * 1.5

    {
      const geometry2 = new SegmentGeometry(0, [length, 0, 0], .05)
      const material2 = new MeshBasicMaterial({ color: '#1d1409' })
      setup(new Mesh(geometry2, material2), {
        parent: this,
        name: 'base-segment'
      })
    }

    {
      const curve = new SinCurveOld({ length, frequency: period, amplitude: .1, offset: 0 })
      const geometry1 = new StrokeGeometry(curve, { width: .15, steps: 1000 })
      const material1 = new MeshBasicMaterial({})
      material1.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .fragment.after('map_fragment', /* glsl */`
          float f = cos(vUv.x * 3.14159 * 2.0 * ${period.toFixed(1)}) * 0.5 + 0.5;
          diffuseColor.rgb = mix(${vec3('#4f1388ff')}, ${vec3('#ffb1cfff')}, f);
        `)
      setup(new Mesh(geometry1, material1), {
        parent: this,
        name: 'around-stroke'
      })
    }

    {
      const curve = new SinCurveOld({ length, frequency: period, amplitude: .13, offset: 0 })
      const geometry1 = new StrokeGeometry(curve, { width: [.11, -.08], steps: 1000 })
      const material1 = new MeshBasicMaterial({})
      material1.onBeforeCompile = shader => ShaderForge.with(shader)
        .defines('USE_UV')
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.z += -0.04;
        `)
        .fragment.after('map_fragment', /* glsl */`
          float f = cos(vUv.x * 3.14159 * 2.0 * ${period.toFixed(1)}) * 0.5 + 0.5;
          diffuseColor.rgb = mix(${vec3('#002119ff')}, ${vec3('#044925ff')}, f);
        `)
      setup(new Mesh(geometry1, material1), {
        parent: this,
        name: 'around-stroke'
      })
    }

    {
      const geometry3 = new StrokeGeometry(
        new SinCurveOld({ length, frequency: period, amplitude: .2, offset: 0 }),
        { width: [.2, -0.1], steps: 1000 })
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
      const s = .05
      const color1 = 'hsla(63, 100%, 99%, 1.00)'
      const color2 = 'hsla(71, 20%, 91%, 1.00)'
      const geometry = BufferGeometryUtils.mergeGeometries([
        setVertexColors(new BufferGeometry().setFromPoints([
          new Vector3(0, 0, 0),
          new Vector3(s, 0, 0),
          new Vector3(0, s, 0),
        ]), color1),
        setVertexColors(new BufferGeometry().setFromPoints([
          new Vector3(0, 0, 0),
          new Vector3(-s, 0, 0),
          new Vector3(0, -s, 0),
        ]), color1),
        setVertexColors(new BufferGeometry().setFromPoints([
          new Vector3(0, 0, 0),
          new Vector3(-s, 0, 0),
          new Vector3(0, s, 0),
        ]), color2),
        setVertexColors(new BufferGeometry().setFromPoints([
          new Vector3(0, 0, 0),
          new Vector3(s, 0, 0),
          new Vector3(0, -s, 0),
        ]), color2),
      ])
      const material = new MeshBasicMaterial({ vertexColors: true, side: 2 })
      material.onBeforeCompile = shader => ShaderForge.with(shader)
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.z += -0.1;
        `)
      const mat = material
      const mesh = setup(new Mesh(geometry, mat), {
        parent: this,
        name: 'rivet',
        x: length / 2,
        y: .2,
      })
      setup(mesh.clone(), { parent: this, x: length / 2 - 2 / 3, y: .2 })
      setup(mesh.clone(), { parent: this, x: length / 2 + 2 / 3, y: .2 })
    }
  })()

  onTick(tick: Tick) {

  }
}

function PathStroke(props: TransformProps) {
  useGroup('path-stroke', props, function* (group) {
    setup(new Spiral(), {
      parent: group,
      y: -6,
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
        focus: [1 / 3, 0, 0],
        size: 8
      }}
      // className='bg-[#928bc6]'
      className='bg-[#a8abbc]'
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

