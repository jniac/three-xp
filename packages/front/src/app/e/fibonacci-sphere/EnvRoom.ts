import { CubeCamera, CubeTexture, FloatType, Group, Mesh, Scene, TorusKnotGeometry, WebGLCubeRenderTarget, WebGLRenderer } from 'three'

import { SmoothBoxGeometry } from 'some-utils-three/geometries/SmoothBoxGeometry'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { flipTriangles } from 'some-utils-three/utils/geometry/triangles'
import { setup } from 'some-utils-three/utils/tree'

export class EnvRoom extends Group {
  parts = (() => {
    const walls = setup(new Mesh(
      flipTriangles(new SmoothBoxGeometry(10, 10, 10, 8, 3, 2)),
      new AutoLitMaterial(),
    ), this)

    setup(new Mesh(
      new TorusKnotGeometry(4, .5, 128, 16),
      new AutoLitMaterial({ color: 'rgb(255, 0, 255)', shadowColor: '#000' }),
    ), this)

    setup(new Mesh(
      new TorusKnotGeometry(4, .5, 128, 16),
      new AutoLitMaterial({ color: 'rgb(2, 0, 37)', shadowColor: '#000' }),
    ), {
      parent: this,
      rotation: '0deg, 90deg, 0deg',
    })

    return { walls }
  })()

  #renderTarget: WebGLCubeRenderTarget

  #cubeCamera: CubeCamera

  #needsRender = true

  #appliedScenes = new WeakSet<Scene>()

  constructor(textureSize = 2048) {
    super()
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
