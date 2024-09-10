
import { EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, PMREMGenerator, Texture, WebGLProgramParametersWithUniforms } from 'three'

import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

import { Message } from 'some-utils-ts/message'

import { Three } from '@/tools/basic-three'

import { createSky } from './sky'

import meshStandarMaterialCustomFragment from '../glsl/mesh_standard_material_custom_fragment.glsl'

const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

function loadGltf(url: string) {
  return new Promise<GLTF>(resolve => {
    gltfLoader.load(url, gltf => {
      resolve(gltf)
    })
  })
}

function loadRgbe(url: string) {
  return new Promise<Texture>(resolve => {
    rgbeLoader.load(url, texture => {
      // Assuming the texture is an equirectangular HDR image:
      texture.mapping = EquirectangularReflectionMapping
      resolve(texture)
    })
  })
}

/**
 * Setup a scene with a helmet model and a sky.
 */
export async function* twoEnvDemo(three: Three) {
  const { scene, orbitControls } = three

  orbitControls.object.position.set(2, .5, 3.5)
  orbitControls.update()

  const group = new Group()
  scene.add(group)

  // Unmount:
  yield () => {
    scene.remove(group)
  }

  const pmremGenerator = new PMREMGenerator(three.renderer)
  const env1 = await loadRgbe('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr')
  const env2 = await loadRgbe('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr')

  const envMap1 = pmremGenerator.fromEquirectangular(env1).texture
  const envMap2 = pmremGenerator.fromEquirectangular(env2).texture

  const helmet = await loadGltf('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf')
  group.add(helmet.scene)

  const shaders = [] as WebGLProgramParametersWithUniforms[]
  helmet.scene.traverse(child => {
    if (child instanceof Mesh) {
      const { material } = child
      if (material instanceof MeshStandardMaterial) {
        material.envMap = envMap1 // enable envMap

        material.onBeforeCompile = shader => {
          shaders.push(shader)
          shader.uniforms.envMap1 = { value: envMap1 }
          shader.uniforms.envMap2 = { value: envMap2 }
          shader.uniforms.uEnvMix = { value: 0 }
          shader.fragmentShader = meshStandarMaterialCustomFragment
        }
      }
    }
  })

  const sky = createSky(envMap1, envMap2)
  group.add(sky)

  // Message handling:

  yield Message.on('INPUT:ENV_MIX', message => {
    const { value } = message.payload
    for (const shader of shaders) {
      shader.uniforms.uEnvMix.value = value
    }
    sky.material.uniforms.uEnvMix.value = value
  })

  yield Message.on('INPUT:SKY_ROUGHNESS', message => {
    const { value } = message.payload
    sky.material.uniforms.uRoughness.value = value
  })
}
