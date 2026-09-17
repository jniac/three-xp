'use client'
import { Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry, TorusGeometry } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { loop2 } from 'some-utils-ts/iteration/loop'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

function ThreeSettings() {
  useGroup('ThreeSettings', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ size: 20, subdivisions: [40] })

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
      .varying({
        'vFoo': 'vec3',
      })
      .vertex.mainAfterAll(/* glsl */`
        gl_Position.z += -uDepthOffset;
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
    setup(new Mesh(
      new TorusGeometry(1, .25, 32, 96),
      new AutoLitMaterial(),
    ), {
      parent: group,
    })

    R.setRandom('parkmiller')
    const planeGeometry = new PlaneGeometry()
    for (const it of loop2(5, 5)) {
      setup(new Mesh(planeGeometry, new CustomMeshBasicMaterial({
        color: R.hexColor({ hue: [0, 1], saturation: [0.5, 1], lightness: [0.5, 0.8] }),
        depthOffset: R.float(0, .0075),
        side: 2,
      })), {
        parent: group,
        x: it.lerpX(-1, 1),
        y: it.lerpY(-1, 1),
      })
    }
  }, [])

  return null
}

function UI() {
  return (
    <div className='thru fixed inset-0 p-4 flex flex-col gap-1 items-start'>
      <pre className='bg-black/50 p-4 rounded text-white backdrop-blur-2xl border border-[#338] line-through'>
        gl_Position.z += -uDepthOffset;
      </pre>
      <p className='line-through'>
        And that's all.
      </p>
      <button>
        <a href='./depth-offset-3' className='text-blue-400 underline'>
          Go to depth-offset-3
        </a>
      </button>
    </div>
  )
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 4,
      }}
    >
      <ThreeSettings />
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
