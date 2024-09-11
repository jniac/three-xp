import { ShaderForge } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_web_colors } from 'some-utils-ts/glsl/colors/web_colors'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Ticker } from 'some-utils-ts/ticker'
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

export class GradientPlane extends Mesh {
  constructor(props?: TransformProps) {
    const geometry = new PlaneGeometry(1, 1)
    const material = new MeshBasicMaterial({
      side: DoubleSide,
    })
    super(geometry, material)
    applyTransform(this, props)

    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({ USE_UV: '' })
      .uniforms({
        uTime: { get value() { return Ticker.current().time } },
      })
      .fragment.top(
        glsl_easings,
        glsl_ramp,
        glsl_web_colors,
        glsl_utils)
      .fragment.after('map_fragment', /* glsl */ `
        float alpha = vUv.x;
        float p = pow(1.3, lerp(0.0, 6.0, sin01(uTime * 0.5)));
        alpha = easeInOut(alpha, p, 0.5);
        diffuseColor.rgb = mix(red, blue, easeOutIn10(vUv.y));

        Vec3Ramp r = ramp(vUv.x, red, blue, green, yellow);
        diffuseColor.rgb = mix(r.a, r.b, easeInOut(r.t, 1.2, 0.5));
      `)
  }
}
