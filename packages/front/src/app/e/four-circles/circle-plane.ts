'use client'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { glsl_sdf2d } from 'some-utils-ts/glsl/sdf-2d'
import { Ticker } from 'some-utils-ts/ticker'
import { Color, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

const planeGeometry = new PlaneGeometry(4, 4)
const sphereGeometry = new IcosahedronGeometry(1, 12)

const colors = [
  '#ff9966',
  '#ff99ff',
  '#112233',
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
      .fragment.top(glsl_sdf2d)
      .fragment.after('color_fragment', /* glsl */ `
        vec2 p = (vUv - 0.5) * 2.0;
        float d = sdBox(p, vec2(0.8));
        float d2 = sin(uTime) * 0.5 + 0.5;
        d2 *= 0.1;
        vec3 color = mix(uColors[0], uColors[1], smoothstep(-d2, d2, d));
        color = mix(color, uColors[2], smoothstep(0.001, 0.0, length(p) - 0.8));
        diffuseColor.rgb = color;
      `)
    const plane = new Mesh(planeGeometry, material)
    this.add(plane)

    return { plane }
  })()
}
