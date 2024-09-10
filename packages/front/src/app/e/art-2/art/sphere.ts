import { Color, IcosahedronGeometry, Mesh, MeshPhysicalMaterial } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'

import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { colors } from './colors'

const defaultMainSphereProps = {
  radius: 1,
}

export function createMainSphere(props?: TransformProps & Partial<typeof defaultMainSphereProps>) {
  const {
    radius,
    ...transformProps
  } = { ...defaultMainSphereProps, ...props }

  const geometry = new IcosahedronGeometry(radius, 12)
  const material = new MeshPhysicalMaterial()
  material.onBeforeCompile = shader => ShaderForge.with(shader)
    .defines({ USE_UV: '' })
    .fragment.top(glsl_ramp)
    .fragment.after('map_fragment', /* glsl */ `
      vec2 p = vUv - 0.5;
      float alpha = vUv.y;
      diffuseColor.rgb = regularRampEaseInout4(alpha,
        ${vec3(colors.black)},
        ${vec3(colors.white)},
        ${vec3(colors.yellow)});
    `)

  const mesh = new Mesh(geometry, material)
  applyTransform(mesh, transformProps)

  return mesh
}

const defaultSmallGradientSphereProps = {
  radius: .2,
  colorTop: colors.white,
  colorBottom: colors.yellow,
  emmissiveIntensity: .25,
}
let smallGradientSphereNextId = 0
export function createSmallGradientSphere(props?: TransformProps & Partial<typeof defaultSmallGradientSphereProps>) {
  const {
    radius,
    colorTop,
    colorBottom,
    emmissiveIntensity,
    ...transformProps
  } = { ...defaultSmallGradientSphereProps, ...props }

  const geometry = new IcosahedronGeometry(radius, 12)
  const material = new MeshPhysicalMaterial({
    color: colorTop,
    emissive: colorBottom,
  })
  material.onBeforeCompile = shader => {
    ShaderForge.with(shader)
      .defines({ USE_UV: '' })
      .uniforms({
        colorTop: { value: new Color(colorTop) },
        colorBottom: { value: new Color(colorBottom) },
      })
      .fragment.top(glsl_ramp, glsl_utils)
      .fragment.mainBeforeAll(/* glsl */ `
        float alpha = inverseLerp(.3, .7, vUv.y);
        vec3 sphereColor = regularRampEaseInout6(alpha, colorBottom, colorTop);
      `)
      .fragment.after('map_fragment', /* glsl */ `
        diffuseColor.rgb = sphereColor;
      `)
      .fragment.after('emissivemap_fragment', /* glsl */ `
        totalEmissiveRadiance.rgb = sphereColor * ${emmissiveIntensity.toFixed(2)};
      `)
  }

  const mesh = new Mesh(geometry, material)
  mesh.name = `SmallGradientSphere-${smallGradientSphereNextId++}`
  applyTransform(mesh, transformProps)

  return mesh
}

