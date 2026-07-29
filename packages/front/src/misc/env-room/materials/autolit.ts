import { Color, ColorRepresentation, Matrix4, MeshBasicMaterial, MeshBasicMaterialParameters } from 'three'
import { mat4, mix, normalWorld, positionWorld, uniform } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

import { EulerDeclaration, fromEulerDeclaration, Vector3Declaration } from 'some-utils-three/declaration'
import { fromVector3Declaration } from 'some-utils-three/declaration/vector'
import { ShaderForge } from 'some-utils-three/shader-forge'

const defaultAlteration1 = {
  rotation: <EulerDeclaration>[.3, -1, 1],
  intensity: 1,
}

function getAlteration1Matrix(parameters: typeof defaultAlteration1, out = new Matrix4()) {
  return out.makeRotationFromEuler(fromEulerDeclaration(parameters.rotation)).setPosition(-13, 4, -11)
}

function getAlteration1Glsl(parameters: typeof defaultAlteration1) {
  const { intensity } = parameters
  return /* glsl */`
    vec3 transformedPositionWorld = (uAlterationMatrix * vec4(sf_vWorldPosition, 1.0)).xyz;
    float variance = pow(fract(length(transformedPositionWorld) / 3.0), 1.0 / 2.0);
    variance = mix(-0.1, 0.2, variance) * 0.5;
    variance = variance * ${intensity.toFixed(6)};
    light = light + variance;
  `
}

function getAlteration1Node(parameters: typeof defaultAlteration1) {
  const { intensity } = parameters
  const m4 = getAlteration1Matrix(parameters)
  const transformedPositionWorld = mat4(m4).mul(positionWorld).xyz
  const variance = transformedPositionWorld.length().div(3).fract().pow(1 / 2).remapClamp(0, 1, -.1, .2).mul(.5)
  return variance.mul(intensity)
}

export const defaultAutolitParameters = {
  color: <ColorRepresentation>'#ffe',
  shadowColor: <ColorRepresentation>'#123',
  lightSource: <Vector3Declaration>[1, 6, 2],
  alteration1: <boolean | Partial<typeof defaultAlteration1>>false,
}

export type AutolitParameters = MeshBasicMaterialParameters & typeof defaultAutolitParameters

export class AutolitMaterial extends MeshBasicMaterial {
  constructor(parameters?: Partial<AutolitParameters>) {
    const {
      color: colorArg,
      shadowColor,
      lightSource,
      alteration1: alteration1Arg,
      ...baseParameters
    } = { ...defaultAutolitParameters, ...parameters }

    super(baseParameters)

    const uniforms = {
      uColor: { value: new Color(colorArg) },
      uShadowColor: { value: new Color(shadowColor) },
      uLightSource: { value: fromVector3Declaration(lightSource) },
      uAlterationMatrix: { value: new Matrix4() },
    }

    const alteration1 = alteration1Arg ? { ...defaultAlteration1, ...(typeof alteration1Arg === 'object' ? alteration1Arg : {}) } : null
    let alteration1Glsl = ''
    if (alteration1) {
      // Compute the alteration matrix and set it as a uniform
      getAlteration1Matrix(alteration1, uniforms.uAlterationMatrix.value)
      alteration1Glsl = getAlteration1Glsl(alteration1)
    }

    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .createVarying(
        'sf_vWorldNormal',
        'sf_vWorldPosition',
      )
      .fragment.top(/* glsl */`
        float remapClamp(float value, float min1, float max1, float min2, float max2) {
          float t = clamp((value - min1) / (max1 - min1), 0.0, 1.0);
          return mix(min2, max2, t);
        }
      `)
      .fragment.after('color_fragment', /* glsl */`
        vec3 normalWorld = normalize(sf_vWorldNormal);
        // Ensure the normal is facing the correct direction based on the fragment's facing
        if (!gl_FrontFacing) {
          normalWorld = -normalWorld;
        }
        float light = dot(normalWorld, normalize(uLightSource));
        light = remapClamp(light, -1.0, 1.0, 0.0, 1.0);
        ${alteration1Glsl}
        diffuseColor.rgb = mix(uShadowColor, uColor, light);
      `)
  }

  customProgramCacheKey(): string {
    return 'AutolitMaterial' + Date.now()
  }
}

export class AutolitNodeMaterial extends MeshBasicNodeMaterial {
  constructor(parameters?: MeshBasicMaterialParameters & Partial<typeof defaultAutolitParameters>) {
    const {
      color: colorArg,
      shadowColor,
      lightSource,
      alteration1: alteration1Arg,
      ...baseParameters
    } = { ...defaultAutolitParameters, ...parameters }
    super(baseParameters)
    const uniforms = {
      uColor: uniform(new Color(colorArg)),
      uShadowColor: uniform(new Color(shadowColor)),
      uLightSource: uniform(fromVector3Declaration(lightSource))
    }

    let light = normalWorld.dot(uniforms.uLightSource.normalize()).remapClamp(-1, 1, 0, 1)

    const alteration1 = alteration1Arg ? { ...defaultAlteration1, ...(typeof alteration1Arg === 'object' ? alteration1Arg : {}) } : null
    if (alteration1) {
      light = light.add(getAlteration1Node(alteration1))
    }

    this.colorNode = mix(uniforms.uShadowColor, uniforms.uColor, light)
  }
}
