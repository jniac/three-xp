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

    const gpuCompute = new GpuCompute({
      size: 64,
    })
      .initialize(three.renderer, {
        fragColor: /* glsl */`
          vec2 uv = vUv;
          float h = hash(uv);
          h = step(0.6, h);
          gl_FragColor = vec4(h, h, 1.0, 1.0);
        `,
      }, {
        fragColor: /* glsl */`
          vec2 uv = vUv;
          vec2 uv0 = uv + vec2(0.0, 1.0) / uTextureSize;
          vec2 uv1 = uv + vec2(1.0, 1.0) / uTextureSize;
          vec2 uv2 = uv + vec2(1.0, 0.0) / uTextureSize;
          vec2 uv3 = uv + vec2(1.0, -1.0) / uTextureSize;
          vec2 uv4 = uv + vec2(0.0, -1.0) / uTextureSize;
          vec2 uv5 = uv + vec2(-1.0, -1.0) / uTextureSize;
          vec2 uv6 = uv + vec2(-1.0, 0.0) / uTextureSize;
          vec2 uv7 = uv + vec2(-1.0, 1.0) / uTextureSize;
          float sum =
            texture2D(uTexture, uv0).r +
            texture2D(uTexture, uv1).r +
            texture2D(uTexture, uv2).r +
            texture2D(uTexture, uv3).r +
            texture2D(uTexture, uv4).r +
            texture2D(uTexture, uv5).r +
            texture2D(uTexture, uv6).r +
            texture2D(uTexture, uv7).r;

          // Conway's Game of Life rules
          float current = texture2D(uTexture, uv).r;
          if (current > 0.5) {
            if (sum < 1.5 || sum > 3.5) {
              current = 0.0; // Cell dies
            } else {
              current = 1.0; // Cell lives
            }
          } else {
            if (sum == 3.0) {
              current = 1.0; // Cell becomes alive
            }
          }

          gl_FragColor.rgb = vec3(current, current, 1.0);
        `,
      })

    let play = true

    yield onTick('three', () => {
      plane.material.map = gpuCompute.currentTexture()
    })

    yield onTick('three', { timeInterval: .1 }, () => {
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
