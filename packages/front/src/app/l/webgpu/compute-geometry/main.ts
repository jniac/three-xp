import { BufferGeometry, DirectionalLight, Group, Mesh, MeshPhysicalNodeMaterial, PlaneGeometry, Raycaster, TorusKnotGeometry, Vector2, Vector3 } from 'three/webgpu'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeWebGPUContext } from 'some-utils-three/webgpu/experimental/context'
import { setup } from 'some-utils-three/webgpu/utils/tree'
import { Tick } from 'some-utils-ts/ticker'
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

    setup(new DirectionalLight('white', 1.5), {
      parent: this,
      position: [2, 4, 2],
    })

    const planeCpu = setup(new Mesh(new PlaneGeometry(2, 2, 50, 50), new MeshPhysicalNodeMaterial()), {
      parent: this,
      x: 2,
    })
    applyCpuSineWave(planeCpu.geometry, planeCpu.geometry, 0.1, 10)

    const planeGpu = setup(new Mesh(new PlaneGeometry(2, 2, 20, 20), new MeshPhysicalNodeMaterial()), {
      parent: this,
      x: 0,
    })

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
  }

  onTick(tick: Tick, three: ThreeWebGPUContext) {

  }
}