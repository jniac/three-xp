import { Color, ColorRepresentation, IcosahedronGeometry, Mesh, MeshPhysicalMaterial } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'

import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { colors } from './colors'

type MainSphereProps = TransformProps & Partial<typeof MainSphere.defaultProps>

export class MainSphere extends Mesh {
  static defaultProps = { radius: 1 }

  constructor(props?: TransformProps & Partial<typeof MainSphere.defaultProps>) {
    const {
      radius,
      ...transformProps
    } = { ...MainSphere.defaultProps, ...props }

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

    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

export class SmallGradientSphere extends Mesh {
  static defaultProps = {
    radius: .225,
    singleColor: null as ColorRepresentation | null,
    colorTop: colors.white,
    colorBottom: colors.yellow,
    emmissiveIntensity: .25,
  }

  constructor(props?: TransformProps & Partial<typeof SmallGradientSphere.defaultProps>) {
    const {
      radius,
      singleColor,
      emmissiveIntensity,
      ...transformProps
    } = { ...SmallGradientSphere.defaultProps, ...props }
    const {
      colorTop = singleColor ?? SmallGradientSphere.defaultProps.colorTop,
      colorBottom = singleColor ?? SmallGradientSphere.defaultProps.colorBottom,
    } = { ...props }

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

    super(geometry, material)
    applyTransform(this, transformProps)
  }
}
