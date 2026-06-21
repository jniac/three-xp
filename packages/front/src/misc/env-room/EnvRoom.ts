import { CubeCamera, Group, HalfFloatType, IcosahedronGeometry, Scene, TorusKnotGeometry, UnsignedByteType, WebGLCubeRenderTarget, WebGLRenderer } from 'three'
import { CubeRenderTarget, WebGPURenderer } from 'three/webgpu'

import { SmoothBoxGeometry } from 'some-utils-three/geometries/SmoothBoxGeometry'
import { flipTriangles } from 'some-utils-three/utils/geometry/triangles'
import { setup } from 'some-utils-three/utils/tree'

import { AutolitParameters } from './materials/autolit'
import { AdaptiveMesh, AutolitMesh, SoftMesh } from './meshes'
import { getRenderTargetFloatSupport } from './utils'

const defaultParameters = {
  textureSize: 2048,
  walls: <null | Partial<AutolitParameters>>null,
}

export class EnvRoom extends Group {
  static utils = {
    getRenderTargetFloatSupport,
  }

  parameters: typeof defaultParameters

  walls: AutolitMesh

  constructor(parameters?: Partial<typeof defaultParameters>) {
    super()
    this.parameters = { ...defaultParameters, ...parameters }
    this.walls = setup(new AutolitMesh(
      flipTriangles(new SmoothBoxGeometry(10, 10, 10, 8, 3, 2)),
      {
        color: 'hsl(203, 10%, 91%)',
        shadowColor: 'hsl(288, 10%, 10%)',
        ...this.parameters.walls,
      }
    ), this)
  }

  #webglRenderTarget?: WebGLCubeRenderTarget
  #webgpuRenderTarget?: CubeRenderTarget
  #cubeCamera?: CubeCamera

  #getWebglRenderTarget(renderer: WebGLRenderer): WebGLCubeRenderTarget {
    const create = () => {
      const { floatRenderTarget, halfFloatRenderTarget } = getRenderTargetFloatSupport(renderer)
      const type = floatRenderTarget || halfFloatRenderTarget ? HalfFloatType :
        UnsignedByteType
      return new WebGLCubeRenderTarget(this.parameters.textureSize, { generateMipmaps: false, type })
    }
    return this.#webglRenderTarget ??= create()
  }

  #getWebgpuRenderTarget(renderer: WebGPURenderer): CubeRenderTarget {
    const create = () => {
      const type = HalfFloatType
      return new CubeRenderTarget(this.parameters.textureSize, { generateMipmaps: false, type })
    }
    return this.#webgpuRenderTarget ??= create()
  }

  #getCubeCamera(renderTarget: WebGLCubeRenderTarget | CubeRenderTarget) {
    return this.#cubeCamera ??= new CubeCamera(0.1, 100, renderTarget)
  }

  /**
   * Resets the texture by clearing the WebGL and WebGPU render targets and the cube camera.
   * 
   * This is useful if you want to re-render the environment into a new texture.
   */
  resetTexture(): this {
    this.#webglRenderTarget = undefined
    this.#webgpuRenderTarget = undefined
    this.#cubeCamera = undefined
    return this
  }

  addLights({
    topLightColor = '#ffc',
    topLightIntensity = 4,
    bottomLightColor = '#cff',
    bottomLightIntensity = 2,
  } = {}) {
    const sphereGeometry = new IcosahedronGeometry(1, 8)

    setup(new SoftMesh(
      sphereGeometry,
      {
        color: topLightColor,
        intensity: topLightIntensity,
      }
    ), {
      scale: 4,
      parent: this,
      y: 5,
    })

    setup(new SoftMesh(
      sphereGeometry,
      {
        color: bottomLightColor,
        intensity: bottomLightIntensity,
      },
    ), {
      parent: this,
      scale: 4,
      position: [1, -5, 1],
    })

    return this
  }

  addTorusKnots({
    color1 = 'hsl(0, 0%, 37%)',
    shadowColor1 = '#111',
    color2 = '#111',
    shadowColor2 = '#000',
  } = {}) {
    setup(new AutolitMesh(
      new TorusKnotGeometry(4, 2 / 3, 256, 32),
      {
        color: color1,
        shadowColor: shadowColor1,
      }
    ), {
      parent: this,
      rotation: '30deg, 0, 0',
    })

    setup(new AutolitMesh(
      new TorusKnotGeometry(4, 1 / 4, 256, 32),
      {
        color: color2,
        shadowColor: shadowColor2,
      }
    ), {
      parent: this,
      rotation: '0, 0, 90deg',
    })

    return this
  }

  removeAllExceptWalls(): this {
    for (const child of [...this.children]) {
      if (child !== this.walls) {
        this.remove(child)
      }
    }
    return this
  }

  adaptMaterials(renderer: WebGLRenderer | WebGPURenderer): this {
    this.traverse(child => {
      if (child instanceof AdaptiveMesh) {
        child.adaptMaterial(renderer)
      }
    })
    return this
  }

  render(renderer: WebGLRenderer | WebGPURenderer): this {
    if (renderer instanceof WebGLRenderer) {
      const renderTarget = this.#getWebglRenderTarget(renderer)
      this.#cubeCamera ??= this.#getCubeCamera(renderTarget)
      this.#cubeCamera.update(renderer, this)
    }

    else if (renderer instanceof WebGPURenderer) {
      const renderTarget = this.#getWebgpuRenderTarget(renderer)
      this.#cubeCamera ??= this.#getCubeCamera(renderTarget)
      this.#cubeCamera.update(renderer, this)
    }

    else {
      throw new Error(`Unsupported renderer type: ${renderer}`)
    }

    return this
  }

  applyToScene(scene: Scene, renderer: WebGLRenderer | WebGPURenderer) {
    this.adaptMaterials(renderer)

    this.render(renderer)

    const texture = this.getTexture()
    scene.background = texture
    scene.environment = texture
  }

  getTexture() {
    return this.#webglRenderTarget?.texture ?? this.#webgpuRenderTarget?.texture ?? null
  }
}
