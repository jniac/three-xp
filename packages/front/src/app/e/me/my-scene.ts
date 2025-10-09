import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { GpuCompute } from './gpu-compute'

export function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {

    const material = new MeshBasicMaterial({
      map: new DebugTexture(),
    })
    const plane = setup(new Mesh(new PlaneGeometry(), material), group)
    plane.scale.setScalar(10)

    const gpuCompute = new GpuCompute({
      size: 64,
    })
      .initialize(three.renderer, {
        fragColor: /* glsl */`
          vec2 uv = vUv;
          float h = hash(uv);
          h = step(0.1, h);
          gl_FragColor = vec4(h, h, 1., 1.);
        `,
      })

    onTick('three', tick => {
      plane.material.map = gpuCompute.currentTexture()
    })

  }, [])

  return null
}
