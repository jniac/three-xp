'use client'
import { BufferGeometry, ColorRepresentation, Mesh, MeshBasicMaterial } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { ShaderForge } from 'some-utils-three/shader-forge'

export class AutoLitWireframeMesh extends Mesh {
  constructor(geometry: BufferGeometry, {
    baseColor = 'white',
    wireframeColor = 'black',
    shadowColor = undefined as ColorRepresentation | undefined,
  } = {}) {
    const autolitMaterial = new AutoLitMaterial({ color: baseColor, shadowColor })
    super(geometry, autolitMaterial)

    const wireframe = new Mesh(geometry, new MeshBasicMaterial({
      color: wireframeColor,
      wireframe: true,
    }))
    wireframe.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .createVarying('sf_vWorldNormal', 'sf_vWorldPosition')
      .vertex.mainAfterAll(/* glsl */ `
        vec3 v = normalize(cameraPosition - sf_vWorldPosition);
        float ndotv = dot(sf_vWorldNormal, v);
        float shift = sign(ndotv) * 0.0001 / (0.1 + abs(ndotv));
        gl_Position.w *= 1.0 + shift;
      `)
    this.add(wireframe)
  }
}
