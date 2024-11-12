import { Color, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_sdf2d } from 'some-utils-ts/glsl/sdf-2d'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Ticker } from 'some-utils-ts/ticker'

const planeGeometry = new PlaneGeometry(4, 4)
const sphereGeometry = new IcosahedronGeometry(1, 12)

export class CirclePlane extends Group {
  parts = (() => {
    const colors = [
      '#95c3fb',
      '#fcff99',
      '#0a1521',
    ].map(c => new Color(c))

    const material = new MeshBasicMaterial()
    const uniforms = {
      uTime: Ticker.get('three').uTime,
      uTimeCycleOffset: { value: 0 },
      uColors: { value: colors },
    }
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .defines({
        USE_UV: '',
      })
      .varying({
        vWorldPosition2: 'vec3',
      })
      .vertex.mainAfterAll(/* glsl */ `
        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;
      `)
      .fragment.top(
        glsl_sdf2d,
        glsl_stegu_snoise,
        glsl_utils,
        glsl_easings,
      )
      .fragment.top(/* glsl */ `
        float globalNoise;
        void computeGlobalNoise() {
          globalNoise = fnoise(vec3(vWorldPosition2.xy * 0.5, uTime * 0.01), 8, 0.8);
        }
        float radius() {
          return 0.75;
        }
        vec2 point() {
          return (vUv - 0.5) * 2.0;
        }
        float time() {
          return uTime * 0.05 + uTimeCycleOffset * 1.0;
        }
        float noisyBox() {
          return sdBox(point(), vec2(radius())) + globalNoise * 0.1 * sin01(time());
        }
        float noisyCircle() {
          return length(point()) - radius() + globalNoise * 0.3 * sin01(time());
        }
      `)
      .fragment.mainBeforeAll(/* glsl */ `
        computeGlobalNoise();
      `)
      .fragment.after('color_fragment', /* glsl */ `
        float d = sdBox(point(), vec2(radius()));
        float d2 = sin01(time());
        d2 *= 0.1;
        vec3 color = mix(uColors[0], uColors[1], smoothstep(0.001, 0.0, noisyBox()));

        float nc = noisyCircle();
        vec3 circleColor = mix(uColors[1], uColors[2], mix(0.25, 1.0, easeInOut2(inverseLerpUnclamped(-radius(), 0.0, nc))));
        color = mix(color, circleColor, smoothstep(0.001, 0.0, nc));
        diffuseColor.rgb = color;
      `)
    const plane = new Mesh(planeGeometry, material)
    this.add(plane)

    return {
      plane,
      planeUniforms: uniforms,
      colors,
    }
  })()
}
