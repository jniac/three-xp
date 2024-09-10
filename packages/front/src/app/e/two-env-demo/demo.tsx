'use client'

import { EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, PMREMGenerator, Texture, WebGLProgramParametersWithUniforms } from 'three'

import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

import { BasicThreeProvider, Three, UseThree } from '../tools/basic-three'

import { useState } from 'react'
import { Message } from 'some-utils-ts/message'
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

  // scene.environment = env1
  // scene.background = env1

  const helmet = await loadGltf('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf')

  const shaders = [] as WebGLProgramParametersWithUniforms[]
  helmet.scene.traverse(child => {
    if (child instanceof Mesh) {
      const { material } = child
      if (material instanceof MeshStandardMaterial) {
        material.envMap = envMap1 // enable envMap

        material.onBeforeCompile = shader => {
          shaders.push(shader)
          shader.uniforms.uTime = { value: 0 }
          shader.uniforms.envMap1 = { value: envMap1 }
          shader.uniforms.envMap2 = { value: envMap2 }
          shader.uniforms.uEnvMix = { value: 0 }
          shader.fragmentShader = customFragmentGlsl
        }
      }
    }
  })

  yield Message.on('INPUT:ENV_MIX', message => {
    const { value } = message.payload
    for (const shader of shaders) {
      shader.uniforms.uEnvMix.value = value
    }
  })

  yield three.ticker.onTick(tick => {
    for (const shader of shaders) {
      shader.uniforms.uTime.value = tick.time
    }
  })

  group.add(helmet.scene)
}

function UI() {
  const [envMix, setEnvMix] = useState(0)
  function updateEnvMix(value: number) {
    setEnvMix(value)
    Message.send('INPUT:ENV_MIX', { payload: { value } })
  }
  return (
    <div className='UI'>
      <h1>two-env-demo</h1>
      <input
        type="range"
        name="envMix"
        id="envMix"
        min={0}
        max={1}
        step={0.01}
        value={envMix}
        onChange={e => updateEnvMix(parseFloat(e.target.value))}
      />
    </div>
  )
}

export function Demo() {
  return (
    <div className='Demo wraps'>
      <BasicThreeProvider>
        <div className='wraps p-8'>
          <UI />
          <UseThree fn={demo} />
        </div>
      </BasicThreeProvider>
    </div>
  )
}