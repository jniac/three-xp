'use client'

import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { FullscreenButton } from '../shared'

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), group)
    plane.scale.setScalar(10)
    plane.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .fragment.top(glsl_ramp)
      .fragment.after('map_fragment', /* glsl */`
        vec3 data = diffuseColor.rgb;
        diffuseColor.r = clamp(data.r, 0.0, 1.0);
        diffuseColor.g = clamp(-data.r, 0.0, 1.0);

        Vec3Ramp r = ramp(0.5 + data.r * 0.1, ${vec3('#9e0202ff')}, ${vec3('#000000')}, ${vec3('#027254ff')});
        diffuseColor.rgb = mix(r.a, r.b, r.t);
      `)

    setup(new DebugHelper(), group)
      .regularGrid({ size: 10, subdivisions: [2, 5] })
      .onTop()

    const gpuCompute = new GpuComputeWaterDemo({ size: 2 ** 11, viscosity: .99 })
      .initialize(three.renderer)

    yield onTick('three', tick => {
      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        const x = inverseLerp(-5, 5, i.point.x)
        const y = inverseLerp(-5, 5, i.point.y)
        gpuCompute.pointer(x, y, 0.02, 1)
      }
      gpuCompute.update(tick.deltaTime)
      plane.material.map = gpuCompute.currentTexture()
      plane.material.needsUpdate = true
    })

  }, [])

  return null
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
      <div className='layer thru flex flex-col p-12'>
        <h1 className='text-4xl font-bold'>
          GPU Compute - Water Demo
        </h1>
        <p>
          Classic water simulation using a height map and GPU Compute.
        </p>
        <FullscreenButton />
        <FpsMeter />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
