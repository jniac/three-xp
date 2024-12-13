import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { attribute, BufferGeometry, DirectionalLight, DirectionalLightHelper, EquirectangularReflectionMapping, float, Fn, Group, HemisphereLight, HemisphereLightHelper, instanceIndex, Mesh, MeshPhysicalNodeMaterial, mx_noise_vec3, NodeMaterial, normalGeometry, PlaneGeometry, positionGeometry, Raycaster, storage, StorageBufferAttribute, TorusKnotGeometry, transformNormalToView, uniform, vec3, Vector2, Vector3 } from 'three/webgpu'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeWebGPUContext } from 'some-utils-three/webgpu/experimental/context'
import { setup } from 'some-utils-three/webgpu/utils/tree'
import { Tick, Ticker } from 'some-utils-ts/ticker'

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

function applyFooBazQux(targetGeometry: BufferGeometry, targetMaterial: NodeMaterial) {
  const count = targetGeometry.attributes.position.count
  const fooAttribute = new StorageBufferAttribute(targetGeometry.attributes.position.array, 3)
  const bazAttribute = new StorageBufferAttribute(targetGeometry.attributes.position.array, 3)
  const quxAttribute = new StorageBufferAttribute(new Float32Array(count * 3), 3)
  // @ts-ignore
  const fooStorage = storage(fooAttribute, 'vec3', count)
  const bazStorage = storage(bazAttribute, 'vec3', count)
  const quxStorage = storage(quxAttribute, 'vec3', count)
  const uDeltaTime = uniform(float(0))
  uDeltaTime.onFrameUpdate(() => Ticker.get('three').deltaTime)
  // @ts-ignore
  const fooFn = Fn(({ geometry }) => {
    geometry.setAttribute('foo', fooAttribute)
    geometry.setAttribute('baz', bazAttribute)
    geometry.setAttribute('qux', quxAttribute)

    // @ts-ignore
    const computeDelta = Fn(([p]) => {
      const x = float(0)
      const y = float(0)
      const z = p.x.mul(10).sin().remap(-1, 1, -.01, .01)
      const z2 = p.y.mul(20).add(p.x.mul(1).sin().mul(.1)).sin().remap(-1, 1, -.02, .02)
      return vec3(x, y, z.add(z2)).add(mx_noise_vec3(p.mul(4)).mul(.1))
    })

    // @ts-ignore
    const computeUpdate = Fn(() => {
      // Position
      const foo = fooStorage.element(instanceIndex)
      const baz = bazStorage.element(instanceIndex)
      foo.assign(baz.add(computeDelta(foo)))

      // Normal
      const qux = quxStorage.element(instanceIndex)
      const d = float(.1)
      const px1 = foo.add(vec3(d, 0, 0))
      const vx1 = px1.add(computeDelta(px1))
      const px2 = foo.add(vec3(d.negate(), 0, 0))
      const vx2 = px2.add(computeDelta(px2))
      const py1 = foo.add(vec3(0, d, 0))
      const vy1 = py1.add(computeDelta(py1))
      const py2 = foo.add(vec3(0, d.negate(), 0))
      const vy2 = py2.add(computeDelta(py2))
      const vx = vx2.sub(vx1).normalize()
      const vy = vy2.sub(vy1).normalize()
      const normal = vx.cross(vy).normalize()
      qux.assign(normal)
      // @ts-ignore
    })().compute(count)
    return computeUpdate
  })

  targetMaterial.geometryNode = fooFn()
  targetMaterial.positionNode = attribute('foo')
  targetMaterial.normalNode = transformNormalToView(attribute('qux'))
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

    const sky = setup(new HemisphereLight('red', 'blue', 1), this)
    setup(new HemisphereLightHelper(sky, 2), this)

    const planeCpu = setup(new Mesh(new PlaneGeometry(2, 2, 50, 50), new MeshPhysicalNodeMaterial()), {
      parent: this,
      x: 2,
    })
    applyCpuSineWave(planeCpu.geometry, planeCpu.geometry, 0.1, 10)

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
      roughness: .5,
      sheen: 1,
      sheenRoughness: 0,
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
    rgbeLoader.load(url, (environmentMap) => {
      environmentMap.mapping = EquirectangularReflectionMapping
      // three.scene.background = environmentMap
      // three.scene.backgroundBlurriness = .5
      three.scene.environment = environmentMap
      three.scene.environmentIntensity = .25
    })
  }

  onTick(tick: Tick, three: ThreeWebGPUContext) {

  }
}