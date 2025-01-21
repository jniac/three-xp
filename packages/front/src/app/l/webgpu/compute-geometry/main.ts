import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Fn, normalGeometry, positionGeometry } from 'three/tsl'
import { BoxGeometry, BufferGeometry, DirectionalLight, DirectionalLightHelper, EquirectangularReflectionMapping, Group, HemisphereLight, HemisphereLightHelper, Mesh, MeshPhysicalNodeMaterial, PlaneGeometry, Raycaster, TorusKnotGeometry, Vector2, Vector3 } from 'three/webgpu'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeWebGPUContext } from 'some-utils-three/experimental/contexts/webgpu'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'

import { applyFooBazQux } from './foo-bar-qux'
import { createJelly } from './jelly'

export function applyCpuSineWave(source: BufferGeometry, destination: BufferGeometry, amplitude: number, frequency: number) {
  const positionArray = source.attributes.position.array as Float32Array
  const normalArray = source.attributes.normal.array as Float32Array

  const destPositionArray = destination.attributes.position.array as Float32Array

  const position = new Vector3()
  const normal = new Vector3()

  const count = positionArray.length / 3
  for (let i = 0; i < count; i++) {
    position.fromArray(positionArray, i * 3)
    normal.fromArray(normalArray, i * 3)

    const delta = Math.sin(position.x * frequency) * amplitude
    position.addScaledVector(normal, delta)

    position.toArray(destPositionArray, i * 3)
  }

  source.computeVertexNormals()
}

export class Main extends Group {
  parts = (() => {
    const jelly = createJelly()

    setup(new Mesh(new TorusKnotGeometry(.5, .2, 512, 64), jelly.material), {
      parent: this,
      x: -2,
    })

    setup(new Mesh(new TorusKnotGeometry(.5, .2, 512, 64), new MeshPhysicalNodeMaterial({})), {
      parent: this,
      y: 2,
    })

    const sun = setup(new DirectionalLight('white', 1.5), {
      parent: this,
      position: [2, 4, 2],
    })
    setup(new DirectionalLightHelper(sun), this)

    const sky = setup(new HemisphereLight('#ffe0f3', '#6a00ff', 1), {
      parent: this,
      position: [0, 4, 0],
    })
    setup(new HemisphereLightHelper(sky, 2), this)

    const planeCpu = setup(new Mesh(new PlaneGeometry(2, 2, 50, 50), new MeshPhysicalNodeMaterial()), {
      parent: this,
      x: 2,
    })
    applyCpuSineWave(planeCpu.geometry, planeCpu.geometry, 0.1, 10)

    const cube = setup(new Mesh(new BoxGeometry(), new MeshPhysicalNodeMaterial()), {
      parent: this,
      y: -2,
    })

    const planeGpuShader = setup(new Mesh(new PlaneGeometry(2, 2, 50, 50), new MeshPhysicalNodeMaterial()), {
      parent: this,
      x: 2,
      y: 2,
    })
    planeGpuShader.material.positionNode = Fn(() => {
      const delta = positionGeometry.x.mul(10).sin().remap(-1, 1, -.1, .1)
      return positionGeometry.add(normalGeometry.mul(delta))
    })()

    const planeGpu = setup(new Mesh(new PlaneGeometry(2, 2, 200, 200), new MeshPhysicalNodeMaterial({
      // wireframe: true,
      roughness: .2,
      color: '#55d4ff',
      sheen: 1,
      metalness: .8,
      sheenRoughness: 0,
      sheenColor: '#4000a1',
      clearcoat: 1,
      clearcoatRoughness: .2,
      iridescence: 2,
      iridescenceIOR: 1.5,
    })), {
      parent: this,
      x: 0,
    })
    applyFooBazQux(planeGpu.geometry, planeGpu.material)

    const pointer = new Vector2()
    const raycaster = new Raycaster()

    return {
      jelly,
      pointer,
      raycaster,

      planeCpu,
      planeGpu,
    }
  })()

  async *onInitialize(three: ThreeWebGPUContext) {
    const { jelly, pointer, raycaster } = this.parts
    yield handlePointer(document.body, {
      onChange: info => {
        pointer.set((info.position.x / window.innerWidth) * 2 - 1, - (info.position.y / window.innerHeight) * 2 + 1)
        raycaster.setFromCamera(pointer, three.camera)
        const intersects = raycaster.intersectObject(three.scene)

        if (intersects.length > 0) {

          const intersect = intersects[0]

          // @ts-ignore
          jelly.pointerPosition.value.copy(intersect.point)
          // @ts-ignore
          jelly.pointerPosition.value.w = 1 // enable

        } else {

          // @ts-ignore
          jelly.pointerPosition.value.w = 0 // disable

        }
      },
    })

    // NOTE: RGBELoader trigger the "Multiple instances of Three.js being imported." warning, but it's fine...
    const rgbeLoader = new RGBELoader()
    const url = 'https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr'
    rgbeLoader.load(url, (map) => {
      map.mapping = EquirectangularReflectionMapping
      // three.scene.background = environmentMap
      // three.scene.backgroundBlurriness = .5
      three.scene.environment = map
      three.scene.environmentIntensity = .25
    })

    // const { planeGpu } = this.parts
    // const textureLoader = new TextureLoader()
    // planeGpu.material.normalMap =
    //   textureLoader.load('https://threejs.org/examples/textures/carbon/Carbon_Normal.png', map => {
    //     planeGpu.material.clearcoatNormalMap = map
    //   })
  }

  onTick(tick: Tick, three: ThreeWebGPUContext) {

  }
}