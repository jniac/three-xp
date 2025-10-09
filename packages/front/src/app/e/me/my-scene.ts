import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { GpuCompute } from './gpu-compute'

export function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {

    const material = new MeshBasicMaterial({
      map: new DebugTexture(),
    })
    const plane = setup(new Mesh(new PlaneGeometry(), material), group)
    plane.scale.setScalar(10)

    const gpuCompute = GpuCompute.gameOfLifeDemo(three.renderer)

    let play = true

    yield onTick('three', () => {
      plane.material.map = gpuCompute.currentTexture()
    })

    yield onTick('three', { timeInterval: 0 }, () => {
      if (play)
        gpuCompute.update()
    })

    yield handlePointer(document.body, {
      onTap: () => {
        play = !play
      },
    })

  }, [])

  return null
}
