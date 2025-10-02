import { Color, ColorRepresentation, DoubleSide, Group, InstancedMesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { Ticker } from 'some-utils-ts/ticker'

type ColorArgument =
  | ColorRepresentation
  | ColorRepresentation[]
  | ((index: number) => ColorRepresentation)

function solveColorArgument(arg: ColorArgument): (index: number) => Color {
  const color = new Color()

  if (typeof arg === 'function')
    return index => color.set(arg(index))

  if (Array.isArray(arg))
    return index => color.set(arg[index % arg.length])

  color.set(arg)
  return () => color
}

function defaultColorArgument() {
  const color = new Color()
  const r = RandomUtils.new('parkmiller', 123456)
  return () => {
    return color.set(r.int(0x1000000))
  }
}

export class ShadowHillPlanes extends Group {
  timescale = 1;

  constructor({
    count = 8,
    color = <ColorArgument>defaultColorArgument(),
  } = {}) {
    super()
    this.name = 'ShadowHillPlanes'

    const geometry = new PlaneGeometry()

    const material = new MeshBasicMaterial({
      transparent: true,
      side: DoubleSide,
    })

    const uniforms = {
      uTime: { value: 0 },
      uShadowColor: { value: new Color(0x000000) },
    }
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .uniforms(uniforms)
      .varying({
        vHash: 'vec4',
      })
      .top(glsl_utils)
      .vertex.mainAfterAll(/* glsl */ `
        // Push each layer back a little bit to avoid z-fighting
        gl_Position.z += -0.0001 * float(gl_InstanceID);

        vHash = vec4(
          hash(float(gl_InstanceID)),
          hash(float(gl_InstanceID) * 7.3),
          hash(float(gl_InstanceID) * 15.7),
          hash(float(gl_InstanceID) * 23.9)
        );
      `)
      .fragment.after('map_fragment', /* glsl */ `
        vec2 uv = vUv;
        float threshold0 = 0.5;
        float amplitude = 0.1;
        float threshold1 = threshold0;

        float time = uTime * 0.333;
        threshold1 += amplitude * sin(uv.x * 1.6783 * (1.0 + vHash.z) + vHash.w * 2.0 * 6.28)
          * sin(time * 0.13 + vHash.y * 6.28);
        threshold1 += amplitude * 0.6 * sin(uv.x * 3.739 * (1.0 + vHash.x) + vHash.y * 2.0 * 6.28)
          * sin(time * 0.1 + vHash.w * 6.28);

        // Small waves
        threshold1 += amplitude * 0.2 * sin(uv.x * 8.2837 * (1.0 + vHash.y) + vHash.z * 2.0 * 6.28)
          * sin(time * 0.1172 + vHash.w * 6.28);
        threshold1 += amplitude * 0.1 * sin(uv.x * 9.7427 * (1.0 + vHash.z) + vHash.x * 2.0 * 6.28)
          * sin(time * 0.1172 + vHash.w * 6.28);

        float d0 = threshold0 + amplitude - uv.y;
        float d1 = threshold1 - uv.y;
        if (d1 > 0.0) {
          float shadow = 1.0 - (d0 * 1.0 + d1 * 2.0) * 0.75;
          shadow = clamp(shadow, 0.0, 1.0);

          diffuseColor.rgb = vec3(0.0);
          diffuseColor.a *= shadow;
        }

        diffuseColor.rgb *= 1.0 + 0.25 * (0.5 - hash(gl_FragCoord.xy * 0.005 + uTime));
      `)

    const mesh = new InstancedMesh(geometry, material, count)
    const ticker = Ticker.get('three')
    mesh.onBeforeRender = () => {
      uniforms.uTime.value += ticker.tick.deltaTime * this.timescale
    }
    this.add(mesh)

    const colorGetter = solveColorArgument(color)
    for (let i = 0; i < count; i++) {
      mesh.setMatrixAt(i, makeMatrix4({
        y: (i - (count - 1) / 2) * 0.1,
      }))
      mesh.setColorAt(i, colorGetter(i))
    }
  }
}
