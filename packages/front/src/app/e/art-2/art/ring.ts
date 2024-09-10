import { DoubleSide, Mesh, MeshPhysicalMaterial, RingGeometry } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'

import { colors } from './colors'

const defaultRingProps = {
  color: colors.black,
  radius: 1.3,
  innerRadiusRatio: .66,
  thickness: null as number | null,
  z: 0,
}

export function createRing(props?: TransformProps & Partial<typeof defaultRingProps>) {
  const {
    radius,
    innerRadiusRatio,
    color,
    thickness,
    ...transformProps
  } = { ...defaultRingProps, ...props }

  const innerRadius = thickness === null
    ? radius * innerRadiusRatio
    : radius - thickness
  const geometry = new RingGeometry(innerRadius, radius, 128)
  const material = new MeshPhysicalMaterial({ color, side: DoubleSide })

  const mesh = new Mesh(geometry, material)
  applyTransform(mesh, transformProps)

  return mesh
}

export function createGradientRing(props?: TransformProps & Partial<typeof defaultRingProps>) {
  const mesh = createRing(props)

  mesh.material.onBeforeCompile = shader => ShaderForge.with(shader)
    .defines({ USE_UV: '' })
    .fragment.top(glsl_ramp)
    .fragment.after('map_fragment', /* glsl */ `
      vec2 p = vUv - 0.5;
      float alpha = atan(p.y, p.x) / 6.2831853;
      alpha = 1.0 - mod(alpha + 0.0, 1.0);
      diffuseColor.rgb = regularRampEaseInout4(alpha,
        ${vec3(colors.black)},
        ${vec3(colors.white)},
        ${vec3(colors.yellow)});
    `)

  return mesh
}
