import { Color, ColorRepresentation, IcosahedronGeometry, Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { glsl_utils } from 'some-utils-ts/glsl/utils'

import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { colors } from './colors'

console.log('glsl_ramp', glsl_ramp.slice(0, 10))

type MainSphereProps = TransformProps & Partial<typeof MainSphere.defaultProps>

export class MainSphere extends Mesh {
  static defaultProps = { radius: 1 }

  constructor(props?: TransformProps & Partial<typeof MainSphere.defaultProps>) {
    const {
      radius,
      ...transformProps
    } = { ...MainSphere.defaultProps, ...props }

    const geometry = new IcosahedronGeometry(radius, 18)
    const material = new MeshPhysicalMaterial()
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({ USE_UV: '' })
      .fragment.top(glsl_ramp)
      .fragment.after('map_fragment', /* glsl */ `
        vec2 p = vUv - 0.5;
        float alpha = vUv.y;
        Vec3Ramp r = ramp(alpha, ${vec3(colors.black)}, ${vec3(colors.white)}, ${vec3(colors.yellow)});
        diffuseColor.rgb = mix(r.a, r.b, easeInOut4(r.t));
      `)

    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

type SatelliteProps = typeof Satellite.defaultProps
class Satellite {
  static defaultProps = {
    center: new Vector3(),
    normal: new Vector3(1, 0, 0),
    binormal: new Vector3(0, 1, 0),
    radius: 1,
    turnVelocity: 1,
    turn: 0,
  }

  props!: SatelliteProps

  target: Object3D

  constructor(target: Object3D, props?: Partial<SatelliteProps>) {
    this.target = target
    this.set({ ...Satellite.defaultProps, ...props })
  }

  set(props: Partial<SatelliteProps>) {
    this.props = { ...this.props, ...props }

    this.props.center = this.props.center.clone()
    this.props.normal = this.props.normal.clone().normalize()
    this.props.binormal = this.props.binormal.clone().normalize()
  }

  update(deltaTime: number) {
    const { radius, turnVelocity, turn, center, normal, binormal } = this.props
    const newTurn = turn + turnVelocity * deltaTime
    this.props.turn = newTurn

    const cos = Math.cos(newTurn * Math.PI * 2)
    const sin = Math.sin(newTurn * Math.PI * 2)
    this.target.position.copy(center)
      .addScaledVector(normal, radius * cos)
      .addScaledVector(binormal, radius * sin)
  }
}

export class SmallGradientSphere extends Mesh {
  static defaultProps = {
    radius: .225,
    singleColor: null as ColorRepresentation | null,
    colorTop: colors.white,
    colorBottom: colors.yellow,
    emmissiveIntensity: .25,
    lerpIn: .4,
    lerpOut: .6,
  }

  private _satellite: Satellite | null = null
  get satellite() { return this._satellite ??= new Satellite(this) }

  constructor(props?: TransformProps & Partial<typeof SmallGradientSphere.defaultProps>) {
    const {
      radius,
      singleColor,
      emmissiveIntensity,
      lerpIn,
      lerpOut,
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
          uLerpIn: { value: lerpIn },
          uLerpOut: { value: lerpOut },
          uColorTop: { value: new Color(colorTop) },
          uColorBottom: { value: new Color(colorBottom) },
        })
        .fragment.top(
          glsl_easings,
          glsl_utils)
        .fragment.mainBeforeAll(/* glsl */ `
          float alpha = inverseLerp(uLerpIn, uLerpOut, vUv.y);
          vec3 sphereColor = mix(uColorBottom, uColorTop, easeInOut10(alpha));
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
