import { Color, ColorRepresentation, MeshBasicMaterial } from 'three'
import { cameraPosition, normalWorld, positionWorld, uniform, vec4 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

import { ShaderForge } from 'some-utils-three/shader-forge'

export const defaultSoftParameters = {
  color: <ColorRepresentation>'#fff',
  intensity: 5,
}

export class SoftMaterial extends MeshBasicMaterial {
  constructor(parameters?: Partial<typeof defaultSoftParameters>) {
    const { intensity, ...rest } = { ...defaultSoftParameters, ...parameters }
    super({
      transparent: true,
      depthWrite: false,
      ...rest,
    })
    const uniforms = {
      uIntensity: { value: intensity },
    }
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .createVarying('sf_vViewPosition', 'sf_vViewNormal')
      .fragment.after('color_fragment', /* glsl */`
        float t = pow(dot(normalize(sf_vViewPosition), sf_vViewNormal), 10.0);
        diffuseColor.rgb *= t * uIntensity;
        diffuseColor.a = t;
      `)
  }
}

export class SoftNodeMaterial extends MeshBasicNodeMaterial {
  constructor(parameters?: Partial<typeof defaultSoftParameters>) {
    const { intensity, color, ...rest } = { ...defaultSoftParameters, ...parameters }
    super({
      transparent: true,
      depthWrite: false,
      ...rest,
    })
    const uniforms = {
      uColor: uniform(new Color(color)),
      uIntensity: uniform(intensity),
    }
    const cameraToVertex = positionWorld.sub(cameraPosition).normalize()
    const alpha = cameraToVertex.dot(normalWorld).pow(10)
    this.colorNode = vec4(uniforms.uColor.rgb.mul(uniforms.uIntensity).mul(alpha), alpha)
  }
}
