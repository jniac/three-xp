'use client'

import { BoxGeometry, Color, ColorRepresentation, Group, Mesh, MeshBasicMaterial, WebGLProgramParametersWithUniforms } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'

class InstanceDemo extends Group {
  constructor() {
    super()

    const forkMaterial = (shader: WebGLProgramParametersWithUniforms, color: ColorRepresentation) => {
      ShaderForge.with(shader)
        .uniforms({ uMyColor: { value: new Color(color) } })
        .varying({ vMyColor: 'vec3' })
        .vertex.mainAfterAll(/* glsl */`
          vMyColor = uMyColor;
        `)
        .fragment.after('map_fragment', /* glsl */`
          diffuseColor.rgb = vMyColor;
        `)
      return shader
    }

    const material1 = new MeshBasicMaterial()
    material1.onBeforeCompile = shader => forkMaterial(shader, 'red')
    const mesh1 = setup(new Mesh(new BoxGeometry(), material1), { parent: this, x: -2 })

    const material2 = new MeshBasicMaterial()
    material2.onBeforeCompile = shader => forkMaterial(shader, 'blue')
    const mesh2 = setup(new Mesh(new BoxGeometry(), material2), { parent: this, x: 2 })
  }
}

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('slerp-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid()

    setup(new InstanceDemo(), group)

  }, 'always')

  return null
}

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
      <div className='layer thru p-16'>
        <h1 className='text-4xl font-bold'>
          Shader Forge - Instance
        </h1>
        <p>
          Simple check, everything is fine.
        </p>
      </div>
    </ThreeProvider>
  )
}
