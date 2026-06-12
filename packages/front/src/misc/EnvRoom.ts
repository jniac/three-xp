import { CubeCamera, CubeTexture, FloatType, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, Scene, WebGLCubeRenderTarget, WebGLRenderer } from 'three'

import { SmoothBoxGeometry } from 'some-utils-three/geometries/SmoothBoxGeometry'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { flipTriangles } from 'some-utils-three/utils/geometry/triangles'
import { setup } from 'some-utils-three/utils/tree'

class SoftMaterial extends MeshBasicMaterial {
  static defaultParameters = {
    color: '#fff',
    intensity: 5,
  }

  uniforms = {
    uIntensity: { value: SoftMaterial.defaultParameters.intensity },
  }
  constructor(parameters?: Partial<typeof SoftMaterial.defaultParameters>) {
    const { intensity, ...rest } = { ...SoftMaterial.defaultParameters, ...parameters }
    super({
      transparent: true,
      depthWrite: false,
      ...rest,
    })
    this.uniforms.uIntensity.value = intensity
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .createVarying('sf_vViewPosition', 'sf_vViewNormal')
      .fragment.after('color_fragment', /* glsl */`
        float t = pow(dot(normalize(sf_vViewPosition), sf_vViewNormal), 10.0);
        diffuseColor.rgb *= t * uIntensity;
        diffuseColor.a = t;
      `)
  }
}

export class EnvRoom extends Group {
  parts = (() => {
    const walls = setup(new Mesh(
      flipTriangles(new SmoothBoxGeometry(10, 10, 10, 8, 3, 2)),
      new AutoLitMaterial(),
    ), this)

    const sphereGeometry = new IcosahedronGeometry(1, 10)

    setup(new Mesh(
      sphereGeometry,
      new SoftMaterial({
        color: '#ffc',
        intensity: 3,
      }),
    ), {
      scale: 4,
      parent: this,
      y: 5,
    })

    setup(new Mesh(
      sphereGeometry,
      new SoftMaterial({
        color: '#cff',
        intensity: 3,
      }),
    ), {
      parent: this,
      scale: 4,
      position: [1, -5, 1],
    })

    return { walls }
  })()

  #renderTarget: WebGLCubeRenderTarget

  #cubeCamera: CubeCamera

  #needsRender = true

  #appliedScenes = new WeakSet<Scene>()

  constructor({
    textureSize = 2048,
    scale = 1,
  } = {}) {
    super()
    this.scale.setScalar(scale)
    this.#renderTarget = new WebGLCubeRenderTarget(textureSize, {
      generateMipmaps: true,
      type: FloatType,
    })
    this.#cubeCamera = new CubeCamera(0.1, 100, this.#renderTarget)
  }

  toCubeTexture(): CubeTexture {
    return this.#renderTarget.texture
  }

  renderCubeTexture(renderer: WebGLRenderer) {
    this.#cubeCamera.update(renderer, this)
    this.#needsRender = false

    return this.toCubeTexture()
  }

  applyToSceneOnce(scene: Scene, renderer: WebGLRenderer): CubeTexture {
    const texture = this.toCubeTexture()

    scene.background = texture
    scene.environment = texture

    if (this.#needsRender) {
      this.renderCubeTexture(renderer)
    }

    return texture
  }

  applyToSceneOnBeforeRender(scene: Scene): CubeTexture {
    const texture = this.toCubeTexture()

    scene.background = texture
    scene.environment = texture

    if (this.#appliedScenes.has(scene) === false) {
      const onBeforeRender = scene.onBeforeRender
      scene.onBeforeRender = (renderer, ...args) => {
        onBeforeRender.call(scene, renderer, ...args)

        if (this.#needsRender) {
          this.renderCubeTexture(renderer)
        }
      }
      this.#appliedScenes.add(scene)
    }

    return texture
  }
}
