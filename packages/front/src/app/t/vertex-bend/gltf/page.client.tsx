'use client'


import { config } from '@/config'
import { InspectorView } from 'some-utils-misc/inspector'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { createBendUniforms, glsl_bend, setupBendVertexShader } from 'some-utils-three/glsl/transform/bend'
import { BoxLineHelper } from 'some-utils-three/helpers/box-line'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { isMesh } from 'some-utils-three/is'
import { TransformTool } from 'some-utils-three/objects/tools'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { deepAssign } from 'some-utils-ts/object/deep'
import { GLTFLoader, UltraHDRLoader } from 'three/examples/jsm/Addons.js'
import { BufferGeometry, EquirectangularReflectionMapping, Matrix4, Mesh, MeshPhysicalMaterial, MeshPhysicalMaterialParameters, MeshStandardMaterial, TorusKnotGeometry } from 'three/src/Three.WebGPU.js'

class MyState {
  animate = true
  static bendFactor = {
    type: `
      number
      slider(-1, 1)
    `,
    description: `
      Bend factor for the vertex bend transformation (in radians).
    `,
  }
  bendFactor = 0
}

const glsl_bend_project_vertex = /* glsl */`
  vec4 bendPosition = vec4(transformed, 1.0);
  vec3 bendNormal = vec3(transformedNormal);

  #ifdef USE_BATCHING
    bendPosition = batchingMatrix * bendPosition;
    bendNormal = (batchingMatrix * vec4(bendNormal, 0.0)).xyz;
  #endif
  #ifdef USE_INSTANCING
    bendPosition = instanceMatrix * bendPosition;
    bendNormal = (instanceMatrix * vec4(bendNormal, 0.0)).xyz;
  #endif

  bendPosition = modelMatrix * bendPosition;
  bendNormal = (modelMatrix * vec4(bendNormal, 0.0)).xyz;

  applyBend(bendPosition, bendNormal, uBendFactor, uBendMatrix, uBendMatrixInverse);

  gl_Position = projectionMatrix * viewMatrix * bendPosition;        
  
  // 
  vec4 mvPosition = viewMatrix * bendPosition;
  transformed = bendPosition.xyz;
  transformedNormal = normalize(normalMatrix * bendNormal);
  vNormal = transformedNormal;
`

class MeshBendStandardMaterial extends MeshStandardMaterial {
  bendUniforms = createBendUniforms(new Matrix4())

  constructor(
    params?: ConstructorParameters<typeof MeshStandardMaterial>[0],
  ) {
    super(params)
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.bendUniforms)
      .vertex.top(glsl_bend)
      .vertex.replace('project_vertex', glsl_bend_project_vertex)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `MeshBendMaterial-${MeshBendStandardMaterial.#now}`
  }
}

class MeshBendPhysicalMaterial extends MeshPhysicalMaterial {
  bendUniforms = createBendUniforms(new Matrix4())

  constructor(
    params?: ConstructorParameters<typeof MeshPhysicalMaterial>[0],
  ) {
    super(params)
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.bendUniforms)
      .vertex.top(glsl_bend)
      .vertex.replace('project_vertex', glsl_bend_project_vertex)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `MeshBendPhysicalMaterial-${MeshBendPhysicalMaterial.#now}`
  }
}

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('slerp-scene', async function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid()

    new UltraHDRLoader()
      .load(config.assets('env/royal_esplanade_2k.hdr.jpg'), texture => {
        texture.mapping = EquirectangularReflectionMapping
        three.scene.environment = texture
      })

    const bendUniforms = createBendUniforms()

    const box = setup(new BoxLineHelper({
      divisions: 20,
      onBeforeCompile: shader => setupBendVertexShader(shader, bendUniforms),
    }), group)

    const tool = setup(new TransformTool(), group)
    tool.attach(box)

    const gltfLoader = new GLTFLoader()
    const loadHelmet = async () => {
      const gltf = await gltfLoader.loadAsync(config.assets(`meshes/DamagedHelmet.glb`))
      const helmet = gltf.scene.children[0] as Mesh<BufferGeometry, MeshStandardMaterial>
      helmet.geometry.rotateX(Math.PI / 2)
      return helmet
    }

    const arbitraryGeometry = new TorusKnotGeometry(.5, .275, 512, 128)
    const arbitraryMaterialParams: MeshPhysicalMaterialParameters = {
      roughness: .2,
      metalness: .8,
      clearcoat: 1,
      color: 'hsl(249, 27%, 56%)',
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
    }
    setup(new Mesh(arbitraryGeometry, new MeshPhysicalMaterial(arbitraryMaterialParams)), {
      parent: group,
      position: [-1, 1, 0],
    })
    setup(new Mesh(arbitraryGeometry, new MeshBendPhysicalMaterial(arbitraryMaterialParams)), {
      parent: group,
      position: [1, 1, 0],
    })

    setup(await loadHelmet(), { parent: group, position: [-1, -1, 0] })

    const helmet = await loadHelmet()
    helmet.material = new MeshBendStandardMaterial(helmet.material)
    setup(helmet, { parent: group, position: [1, -1, 0] })

    const state = new MyState()
    yield Message.exposeInstance(MyState, state)

    let time = 0
    yield three.ticker.onTick(tick => {
      if (state.animate) {
        time += tick.deltaTime
        state.bendFactor = Math.sin(time * 1.5) * .5
      }

      bendUniforms.uBendFactor.value = state.bendFactor
      bendUniforms.uBendMatrix.value.copy(box.matrixWorld)
      bendUniforms.uBendMatrixInverse.value.copy(box.matrixWorld).invert()

      group.traverse(child => {
        if (isMesh(child)) {
          const { material } = child
          if (material instanceof MeshBendStandardMaterial || material instanceof MeshBendPhysicalMaterial) {
            material.bendUniforms.uBendFactor.value = bendUniforms.uBendFactor.value
            material.bendUniforms.uBendMatrix.value.copy(bendUniforms.uBendMatrix.value)
            material.bendUniforms.uBendMatrixInverse.value.copy(bendUniforms.uBendMatrixInverse.value)
            material.bendUniforms.uBendColor.value.copy(bendUniforms.uBendColor.value)
          }
        }
      })
    })

  }, 'always')

  return null
}

function MyUI() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const state = await Message.waitForInstance(MyState)
    const inspector = new InspectorView({ header: { title: 'Vertex Bend Demo' } })
    div.replaceChildren(inspector.div)
    inspector.generateFields(state, MyState)
    inspector.onAnyChange((key, value) => {
      deepAssign(state, { [key]: value })
      if (key === 'bendFactor') {
        state.animate = false
      }
    })
  }, [])
  return (
    <div
      ref={ref}
      className='p-4 border rounded border-white/20 bg-black/20 backdrop-blur-lg w-fit'
    ></div>
  )
}

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 6,
        rotation: `-30deg, 30deg, 0deg`,
      }}
    >
      <div className='layer thru flex flex-col items-start p-16 gap-2'>
        <h1 className='text-4xl font-bold'>
          Vertex Shader - Bend
        </h1>
        <MyUI />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
