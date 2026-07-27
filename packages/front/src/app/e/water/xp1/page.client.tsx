'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_color_conversion } from 'some-utils-ts/glsl/color-conversion'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

class WaterMaterial extends MeshBasicMaterial {
  constructor(props?: ConstructorParameters<typeof MeshBasicMaterial>[0]) {
    super(props)
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .fragment.top(
        glsl_color_conversion,
        glsl_utils)
      .fragment.top(/* glsl */`
        float slog(float x) {
          return sign(x) * log(abs(x) + 1.0);
        }
      `)
      .fragment.after('map_fragment', /* glsl */`
        float t = slimited(diffuseColor.r, 2.0) / 2.0;
        diffuseColor.rgb = hsl2rgb(vec3(0.666 + -0.125 * t, 0.0 + abs(t * 0.2), 0.5 + 0.5 * t));
      `)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `water-material-${WaterMaterial.#now}`
  }
}

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    const water = new GpuComputeWaterDemo({
      viscosity: .99,
      damping: .9999999,
    })
    water.initialize(three.renderer)
    console.log('water', water)

    const plane = setup(new Mesh(
      new PlaneGeometry(6, 6),
      new WaterMaterial(),
    ), group)

    yield three.ticker.onTick(tick => {
      const I = three.pointer.raycast(plane)
      if (I.length > 0) {
        const [{ uv }] = I
        water.pointer(uv!.x, uv!.y, three.pointer.buttonDown() ? 100 : 10, 1)
      }
      water.update()
      water.update()
      plane.material.map = water.currentTexture()
    })
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}