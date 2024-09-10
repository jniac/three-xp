import { CircleGeometry, DoubleSide, Mesh, MeshPhysicalMaterial } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'

import { colors } from './colors'

const defaultDiscProps = {
  radius: 1.3,
  z: -.5,
}

export function createDisc(props?: TransformProps & Partial<typeof defaultDiscProps>) {
  const {
    radius,
    ...transformProps
  } = { ...defaultDiscProps, ...props }

  const geometry = new CircleGeometry(radius, 128)
  const material = new MeshPhysicalMaterial({
    side: DoubleSide,
  })
  material.onBeforeCompile = shader => ShaderForge.with(shader)
    .defines({ USE_UV: '' })
    .fragment.top(glsl_ramp)
    .fragment.after('map_fragment', /* glsl */ `
      vec2 p = vUv - 0.5;
      float alpha = (atan(p.y, p.x) / 3.1415926535) * 0.5 + 0.5;
      alpha = 1.0 - mod(alpha + 0.5, 1.0);
      diffuseColor.rgb = regularRampEaseInout2(alpha,
        ${vec3(colors.black)},
        ${vec3(colors.white)},
        ${vec3(colors.white)},
        ${vec3(colors.yellow)});
    `)
  const mesh = new Mesh(geometry, material)
  applyTransform(mesh, transformProps)
  return mesh
}
