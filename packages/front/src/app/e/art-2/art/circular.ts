import { DoubleSide, FrontSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, RingGeometry, Side, TorusGeometry } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'

import { colors } from './colors'

type CircularProps = TransformProps & Partial<typeof Circular.defaultProps>

export class Circular extends Mesh<RingGeometry, MeshPhysicalMaterial | MeshBasicMaterial> {
  static defaultProps = {
    color: colors.black,
    radius: 1.3,
    align: .5,
    thickness: .3,
    innerRadiusRatio: null as number | null,
    shaded: true,
    emissiveIntensity: .333,
  }
  static createMaterial(props: CircularProps & { side: Side }) {
    const {
      color,
      shaded,
      emissiveIntensity,
      side,
    } = { ...Circular.defaultProps, ...props }
    return shaded
      ? new MeshPhysicalMaterial({
        color,
        emissiveIntensity,
        emissive: emissiveIntensity > 0 ? color : undefined,
        side,
      })
      : new MeshBasicMaterial({
        color,
      })
  }
}

export class Ring extends Circular {
  constructor(props?: CircularProps) {
    const {
      radius,
      thickness,
      align,
      innerRadiusRatio,
      color,
      shaded,
      ...transformProps
    } = { ...Circular.defaultProps, ...props }

    let innerRadius = radius - thickness * align
    let outerRadius = radius + thickness * (1 - align)

    if (innerRadiusRatio) {
      innerRadius = radius * innerRadiusRatio
      outerRadius = radius
    }

    const geometry = new RingGeometry(innerRadius, outerRadius, 128)
    const material = Circular.createMaterial({ ...props, side: DoubleSide })

    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

export class Torus extends Mesh<TorusGeometry, MeshPhysicalMaterial | MeshBasicMaterial> {
  constructor(props?: CircularProps) {
    const {
      radius,
      thickness,
      align,
      innerRadiusRatio,
      color,
      shaded,
      emissiveIntensity,
      ...transformProps
    } = { ...Circular.defaultProps, ...props }

    let innerRadius = radius - thickness * align
    let outerRadius = radius + thickness * (1 - align)

    if (innerRadiusRatio) {
      innerRadius = radius * innerRadiusRatio
      outerRadius = radius
    }

    const geometry = new TorusGeometry((innerRadius + outerRadius) / 2, (outerRadius - innerRadius) / 2, 128, 512)
    const material = Circular.createMaterial({ ...props, side: FrontSide })

    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

export class GradientRing extends Ring {
  constructor(props?: CircularProps) {
    super(props)
    this.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({ USE_UV: '' })
      .fragment.top(glsl_ramp)
      .fragment.after('map_fragment', /* glsl */ `
      vec2 p = vUv - 0.5;
      float alpha = atan(p.y, p.x) / 6.2831853;
      alpha = 1.0 - mod(alpha + 0.0, 1.0);
      Vec3Ramp r = ramp(alpha,
        ${vec3(colors.black)},
        ${vec3(colors.white)},
        ${vec3(colors.yellow)});
      diffuseColor.rgb = mix(r.a, r.b, easeInOut4(r.t));
    `)
  }
}
