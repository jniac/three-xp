import { HalfFloatType, Mesh, NearestFilter, OrthographicCamera, PlaneGeometry, RGBAFormat, ShaderMaterial, Texture, Vector2, WebGLRenderer, WebGLRenderTarget } from 'three'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Vector2Declaration } from 'some-utils-ts/declaration'
import { glsl_utils } from 'some-utils-ts/glsl/utils'

function createGpuComputeMaterialUniforms() {
  return {
    uTexture: { value: <Texture | null>null },
    uTextureSize: { value: new Vector2() },
    uTime: { value: 0 },
    uDeltaTime: { value: 0 },
  }
}

const defaultGpuComputeMaterialParams = {
  fragColor: /* glsl */`
    gl_FragColor = vec4(vUv, 1., 1.);
  `,
  texture: <Texture | null>null,
}

type GpuComputeMaterialParams = Partial<typeof defaultGpuComputeMaterialParams>

class GpuComputeMaterial extends ShaderMaterial {
  constructor(userParams?: GpuComputeMaterialParams) {
    const params = { ...defaultGpuComputeMaterialParams, ...userParams }
    const uniforms = createGpuComputeMaterialUniforms()
    uniforms.uTexture.value = params.texture
    super({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.);
        }
      `,
      fragmentShader: /* glsl */ `
        ${glsl_utils}
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform vec2 uTextureSize;
        uniform float uTime;
        uniform float uDeltaTime;
        void main() {
          ${params.fragColor}
        }
      `,
    })
  }
}

const defaultParams = {
  size: <Vector2Declaration>1024,
  type: HalfFloatType,
}

export class GpuCompute {
  parts = {
    orthoCamera: new OrthographicCamera(-1, 1, 1, -1, 0, 1),
    plane: new Mesh(new PlaneGeometry(2, 2), undefined),
  }

  params: typeof defaultParams

  state: {
    size: Vector2
    rta: WebGLRenderTarget
    rtb: WebGLRenderTarget
    time: number
    frame: number
  }

  #innerState?: {
    renderer: WebGLRenderer
    initialMaterial: GpuComputeMaterial
    updateMaterial: GpuComputeMaterial
  }

  get isInitialized() { return !!this.#innerState }

  constructor(userParams?: Partial<typeof defaultParams>) {
    const params = { ...defaultParams, ...userParams }
    this.params = params

    const { type } = params
    const size = fromVector2Declaration(params.size)
    const rta = new WebGLRenderTarget(size.width, size.height, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type,
    })
    const rtb = new WebGLRenderTarget(size.width, size.height, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type,
    })

    this.state = {
      size,
      rta,
      rtb,
      time: 0,
      frame: 0,
    }
  }

  initialize(
    renderer: WebGLRenderer,
    initialMaterialParams?: GpuComputeMaterialParams,
    updateMaterialParams?: GpuComputeMaterialParams,
  ): this {
    const { orthoCamera, plane } = this.parts
    const { rta } = this.state

    const initialMaterial = new GpuComputeMaterial(initialMaterialParams)
    initialMaterial.uniforms.uTextureSize.value.copy(this.state.size)
    initialMaterial.uniforms.uTexture.value = null
    initialMaterial.uniforms.uTime.value = 0
    initialMaterial.uniforms.uDeltaTime.value = 0
    plane.material = initialMaterial

    const updateMaterial = new GpuComputeMaterial(updateMaterialParams)

    this.#innerState = { renderer, initialMaterial, updateMaterial }

    renderer.setRenderTarget(rta)
    renderer.render(plane, orthoCamera)
    renderer.setRenderTarget(null)

    this.state.frame = 0

    return this
  }

  update(deltaTime = 0): this {
    if (!this.#innerState)
      throw new Error('GpuCompute: not initialized')

    const { renderer, updateMaterial } = this.#innerState
    const { orthoCamera, plane } = this.parts
    const { rta, rtb, time, frame } = this.state

    this.state.time += deltaTime

    updateMaterial.uniforms.uTextureSize.value.copy(this.state.size)
    updateMaterial.uniforms.uTexture.value = frame % 2 === 0 ? rta.texture : rtb.texture
    updateMaterial.uniforms.uTime.value = time
    updateMaterial.uniforms.uDeltaTime.value = deltaTime
    plane.material = updateMaterial

    renderer.setRenderTarget(frame % 2 === 0 ? rtb : rta)
    renderer.render(plane, orthoCamera)
    renderer.setRenderTarget(null)

    this.state.frame += 1

    return this
  }

  currentTexture(): Texture {
    return this.state.frame % 2 === 0
      ? this.state.rta.texture
      : this.state.rtb.texture
  }
}
