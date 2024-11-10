import { Color, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { glsl_sdf2d } from 'some-utils-ts/glsl/sdf-2d'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Ticker } from 'some-utils-ts/ticker'

const planeGeometry = new PlaneGeometry(4, 4)
const sphereGeometry = new IcosahedronGeometry(1, 12)

const colors = [
  '#95c3fb',
  '#fcff99',
  '#0a1521',
].map(c => new Color(c))

export class CirclePlane extends Group {
  parts = (() => {
    const material = new MeshBasicMaterial()
    const uniforms = {
      uTime: Ticker.get('three').uTime,
      uColors: { value: colors },
    }
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .defines({
        USE_UV: '',
      })
      .fragment.top(
        glsl_sdf2d,
        glsl_stegu_snoise,
        glsl_utils,
      )
      .fragment.top(/* glsl */ `
        float radius() {
          return 0.75;
        }
        vec2 point() {
          return (vUv - 0.5) * 2.0;
        }
        float noisyBox() {
          float n = fractalNoise(point() * 2.0, 6, 0.9);
          return sdBox(point(), vec2(radius())) + n * 0.2 * sin01(uTime * 0.5);
        }
        float noisyCircle() {
          float n = fractalNoise(point() * 2.0, 6, 0.9);
          return length(point()) - radius() + n * 0.2 * sin01(uTime * 0.5);
        }
      `)
      .fragment.after('color_fragment', /* glsl */ `
        float d = sdBox(point(), vec2(radius()));
        float d2 = sin01(uTime * 0.5);
        d2 *= 0.1;
        // vec3 color = mix(uColors[0], uColors[1], smoothstep(-d2, d2, d));
        vec3 color = mix(uColors[0], uColors[1], smoothstep(0.001, 0.0, noisyBox()));
        color = mix(color, uColors[2], smoothstep(0.001, 0.0, noisyCircle()));
        diffuseColor.rgb = color;
      `)
    const plane = new Mesh(planeGeometry, material)
    this.add(plane)

    return { plane }
  })()
}
