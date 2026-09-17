'use client'
import { Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

function ThreeSettings() {
  useGroup('ThreeSettings', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ size: 20, subdivisions: [20] })

    setup(new SkyMesh({ color: '#226' }), group)
  }, [])

  return null
}

class CustomMeshBasicMaterial extends MeshBasicMaterial {
  static defaultParameters = {
    depthOffset: 0,
  }

  uniforms = {
    uDepthOffset: { value: 0 },
  }

  constructor(params?: MeshBasicMaterialParameters & Partial<typeof CustomMeshBasicMaterial.defaultParameters>) {
    const { depthOffset, ...superParams } = { ...CustomMeshBasicMaterial.defaultParameters, ...params }

    super(superParams)

    this.uniforms.uDepthOffset.value = depthOffset

    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .vertex.replace('project_vertex', /* glsl */`
        vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_BATCHING
          mvPosition = batchingMatrix * mvPosition;
        #endif
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        
        float depthRatio = (mvPosition.z + uDepthOffset) / mvPosition.z;
        mvPosition.xyz *= depthRatio;

        gl_Position = projectionMatrix * mvPosition;
      `)
      .fragment.after('map_fragment', /* glsl */`
        // diffuseColor.rgb = vec3(vFoo.z);
      `)
  }

  static #customProgramCacheKey = `CustomMeshBasicMaterial_${Date.now()}`
  customProgramCacheKey(): string {
    return CustomMeshBasicMaterial.#customProgramCacheKey
  }
}

export function MyScene() {
  useGroup('MyScene', function* (group) {
    R.setRandom('parkmiller')

    setup(new Mesh(new PlaneGeometry(10, 10), new MeshBasicMaterial({
      map: new DebugTexture({ size: 4096 })
    })), {
      parent: group,
      rotationX: '-90deg',
    })

    {
      const geometry = new PlaneGeometry(1, 2)
      const helper = setup(new DebugHelper(), group).zOffset(.01)
      for (const it of loop(10)) {
        const x = it.lerp(-4.5, 4.5)
        const z = it.lerp(-.5, .4)
        setup(new Mesh(geometry, new CustomMeshBasicMaterial({
          depthOffset: z,
          color: `hsl(${it.lerp(0, 360)}, 100%, 30%)`,
          side: 2,
        })), {
          x,
          parent: group,
        })

        helper
          .text([x, 1.2, 0], `${z.toFixed(2)}`, { color: '#f0f', size: .5 })
          .rect({
            center: [it.lerp(-4.5, 4.5), 0, 0],
            size: [1, 2],
          }, { color: '#f0f' })
          .line(
            [-5, 0, z],
            [5, 0, z],
            { color: '#f0f' })
      }
      helper.line(
        [-5, 0, -.6],
        [5, 0, -.6],
        { color: '#00f' })
      helper.line(
        [-5, 0, .5],
        [5, 0, .5],
        { color: '#00f' })

    }
  }, [])

  return null
}

function UI() {
  return (
    <div className='thru fixed inset-0 p-4 flex flex-col gap-4 items-start'>
      <h1 className='text-2xl font-bold p-1'>
        Depth Offset Shader
      </h1>
      <pre className='bg-black/50 p-4 rounded text-white backdrop-blur-2xl border border-[#338] whitespace-pre-line'>
        {`mvPosition = modelViewMatrix * mvPosition;
        
        float depthRatio = (mvPosition.z + uDepthOffset) / mvPosition.z;
        mvPosition.xyz *= depthRatio;

        gl_Position = projectionMatrix * mvPosition;`}
      </pre>
      <p className='p-1'>
        And that's all.
      </p>
    </div>
  )
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
        rotation: '-20deg, 0deg, 0deg',
      }}
    >
      <ThreeSettings />
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
