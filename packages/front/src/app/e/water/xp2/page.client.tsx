'use client'
import { BufferGeometry, Camera, CanvasTexture, Group, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, Vector2, Vector4, WebGLRenderer } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_color_conversion } from 'some-utils-ts/glsl/color-conversion'
import { glsl_utils } from 'some-utils-ts/glsl/utils'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { clamp } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { Header } from '../../me/home/home'
import meSpashTextStr from './me-splash-text.svg?raw'
import { WaterInputMap } from './WaterInputMap'

function getSplashTextTexture() {
  const doc = new DOMParser().parseFromString(meSpashTextStr, 'image/svg+xml')
  const svg = doc.querySelector('svg')!
  svg.querySelector('path')!.setAttribute('fill', 'red')

  const width = parseFloat(svg.getAttribute('width')!)
  const height = parseFloat(svg.getAttribute('height')!)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const texture = new CanvasTexture(canvas)

  const ctx = canvas.getContext('2d')!
  const img = new Image(width, height)
  img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg))
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    texture.needsUpdate = true
  }
  return texture
}

class WaterMaterial extends MeshBasicMaterial {
  uniforms = {
    uSplashText: { value: getSplashTextTexture() },
    /**
     * x: viewport width
     * y: viewport height
     * z: splash texture width
     * w: splash texture height
     */
    uSplashInfo: { value: new Vector4() },
  }

  constructor(props?: ConstructorParameters<typeof MeshBasicMaterial>[0]) {
    super(props)
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .defines('USE_UV')
      .fragment.top(
        glsl_color_conversion,
        glsl_utils,
      )
      .fragment.after('map_fragment', /* glsl */`
        float t = slimited(diffuseColor.r, 2.0) / 2.0;
        
        vec2 splashUv = vUv;
        splashUv.x += t * 0.01;
        splashUv.y += t * 0.01;
        vec4 splashText = texture2D(uSplashText, splashUv);

        // diffuseColor.rgb = hsl2rgb(vec3(0.666 + -0.125 * t, 0.0 + abs(t * 0.2), 0.5 + 0.5 * t));

        vec3 revealColor = mix(${vec3('#ffff20')}, ${vec3('#ff99ff')}, splashText.b);
        vec3 baseColor = ${vec3('#827468')};
        diffuseColor.rgb = mix(baseColor, revealColor, t * mix(-1.25, 0.5, splashText.b * 0.75));
      `)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `water-material-${WaterMaterial.#now}`
  }

  static #onBeforeRender_private = {
    size: new Vector2(),
  }
  onBeforeRender(renderer: WebGLRenderer, scene: Scene, camera: Camera, geometry: BufferGeometry, object: Object3D, group: Group): void {
    const { size } = WaterMaterial.#onBeforeRender_private
    renderer.getSize(size)
    this.uniforms.uSplashInfo.value.set(size.x, size.y, 1800, 900)
  }
}

function getSize(area: number, aspect: number) {
  const height = Math.sqrt(area / aspect)
  const width = height * aspect
  return new Vector2(width, height).round()
}

function MyGroup() {
  const three = useThreeWebGL()
  useGroup('my-group', function* (group) {
    setup(new DebugHelper(), group)
    // .regularGrid()


    const waterAspect = 2
    const waterArea = 220 ** 2
    const waterInput = new WaterInputMap(getSize(waterArea, waterAspect))

    const water = new GpuComputeWaterDemo({
      size: getSize(waterArea, waterAspect),
      viscosity: .99,
      damping: .999,
      inputMap: waterInput.texture,
    })
    water.initialize(three.renderer)

    const plane = setup(new Mesh(
      new PlaneGeometry(20, 10),
      new WaterMaterial(),
      // new MeshBasicMaterial(),
    ), group)

    const controls = Message.requireInstance(VertigoControls)

    let size = 0
    let pointerActiveTime = three.ticker.time
    yield three.ticker.onTick(tick => {
      if (three.pointer.buttonDown() || three.pointer.clientPositionDelta.length() > 2) {
        pointerActiveTime = tick.time
      }
      const timeSincePointerActive = tick.time - pointerActiveTime
      const fakeInputCount = clamp((timeSincePointerActive - 3) * .7, 0, 10)
      waterInput.update(tick.deltaTime, fakeInputCount)

      const I = three.pointer.raycast(plane)
      size = three.pointer.clientPositionDelta.length() * 0.4 + (three.pointer.buttonDown() ? 45 : 0)
      if (I.length > 0) {
        const [{ uv }] = I
        water.pointer(uv!.x, uv!.y, size, 1)
      }
      water.update()
      // water.update()
      plane.material.map = water.currentTexture()
      // plane.material.map = water.params.inputMap
      plane.position.x = 10 - controls.vertigo.state.realSize.x / 2
    })
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: [1, 10],
        inputDOF: 'fixed',
      }}
    >
      <div className='p-4'>
        <Header />
      </div>
      <MyGroup />
    </ThreeProvider>
  )
}