import { BufferGeometry, Material, Mesh, WebGLRenderer } from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { AutolitMaterial, AutolitNodeMaterial, defaultAutolitParameters } from './materials/autolit'
import { defaultSoftParameters, SoftMaterial, SoftNodeMaterial } from './materials/soft'

type AdaptiveMaterialConstructor<M extends Material, MaterialParameters> = new (p?: MaterialParameters) => M

export class AdaptiveMesh<M extends Material, MaterialParameters> extends Mesh {
  materialOptions: {
    parameters: MaterialParameters,
    webgl: AdaptiveMaterialConstructor<M, MaterialParameters>,
    webgpu: AdaptiveMaterialConstructor<M, MaterialParameters>,
  }

  constructor(
    geometry: BufferGeometry,
    WebglMaterial: AdaptiveMaterialConstructor<M, MaterialParameters>,
    WebgpuMaterial: AdaptiveMaterialConstructor<M, MaterialParameters>,
    parameters: MaterialParameters,
  ) {
    super(geometry, new WebglMaterial(parameters))
    this.materialOptions = { parameters, webgl: WebglMaterial, webgpu: WebgpuMaterial }
  }

  adaptMaterial(renderer: WebGLRenderer | WebGPURenderer) {
    if (renderer instanceof WebGLRenderer) {
      this.material = new this.materialOptions.webgl(this.materialOptions.parameters)
    }

    else if (renderer instanceof WebGPURenderer) {
      this.material = new this.materialOptions.webgpu(this.materialOptions.parameters)
    }
  }
}

export class AutolitMesh extends AdaptiveMesh<AutolitMaterial | AutolitNodeMaterial, typeof defaultAutolitParameters> {
  constructor(geometry: BufferGeometry, parameters?: Partial<typeof defaultAutolitParameters>) {
    super(geometry, AutolitMaterial, AutolitNodeMaterial, { ...defaultAutolitParameters, ...parameters })
  }
}

export class SoftMesh extends AdaptiveMesh<SoftMaterial | SoftNodeMaterial, typeof defaultSoftParameters> {
  constructor(geometry: BufferGeometry, parameters?: Partial<typeof defaultSoftParameters>) {
    super(geometry, SoftMaterial, SoftNodeMaterial, { ...defaultSoftParameters, ...parameters })
  }
}
