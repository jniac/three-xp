'use client'

import { EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, Texture } from 'three'

import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

import { BasicThreeProvider, Three, UseThree } from '../tools/basic-three'

import customFragmentGlsl from './mesh-standard-material.glsl'

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

async function* demo(three: Three) {
  const { scene } = three
  let mounted = true
  const group = new Group()
  scene.add(group)

  // Unmount:
  yield () => {
    mounted = false
    scene.remove(group)
  }

  const env1 = await loadRgbe('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr')
  const env2 = await loadRgbe('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr')

  scene.environment = env2
  scene.background = env2

  const helmet = await loadGltf('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf')

  helmet.scene.traverse(child => {
    if (child instanceof Mesh) {
      const { material } = child
      if (material instanceof MeshStandardMaterial) {
        // Function to replace all #include statements with actual chunks

        material.onBeforeCompile = shader => {
          shader.uniforms.envMap1 = { value: env1 }
          shader.uniforms.envMap2 = { value: env2 }
          shader.uniforms.envMix = { value: 0 }
          shader.fragmentShader = customFragmentGlsl
        }
      }
    }
  })

  group.add(helmet.scene)
}

export function Demo() {
  return (
    <div className='wraps'>
      <BasicThreeProvider>
        <UseThree fn={demo} />
      </BasicThreeProvider>
    </div>
  )
}