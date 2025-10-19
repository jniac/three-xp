import { DataTexture, Group, LinearFilter, LinearMipMapLinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, ShapeGeometry, Texture, Vector2, Vector3 } from 'three'
import { BufferGeometryUtils, SVGLoader } from 'three/examples/jsm/Addons.js'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'
import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { anyLoader } from 'some-utils-three/loaders/any-loader'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { flipNormals } from 'some-utils-three/utils/geometry/normals'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_blending } from 'some-utils-ts/glsl/blending'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_texture_bicubic } from 'some-utils-ts/glsl/texture-bicubic'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { clamp, inverseLerp, inverseLerpUnclamped, lerpUnclamped } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { promisify } from 'some-utils-ts/misc/promisify'
import { Destroyable } from 'some-utils-ts/types'

import { homeTextSvg } from './home-text.svg'
import { Responsive } from './responsive'

const WATER_SIZE_DESKTOP = 120 * 3
const WATER_SIZE_MOBILE = 80 * 3
const VISCOSITY = .995
const DAMPING_IDLE = .995

function svgToTexture(svg: any, width = 512, height = 512) {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const img = new Image()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const sourceTexture = new DataTexture(new Uint8Array(4 * 4 * 4).fill(255), 4, 4)
  sourceTexture.generateMipmaps = true
  sourceTexture.minFilter = LinearMipMapLinearFilter
  sourceTexture.magFilter = LinearFilter
  const texture = promisify(sourceTexture)

  img.onload = () => {
    ctx.transform(1, 0, 0, -1, 0, height) // flip Y
    ctx.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(url)
    texture.image = {
      data: ctx.getImageData(0, 0, width, height).data,
      width,
      height,
    }
    texture.needsUpdate = true
    texture.resolve()
  }
  img.onerror = (e) => {
    texture.reject(e)
  }
  img.src = url

  return texture
}

function applyAspect<T extends { x: number, y: number } = Vector2>(aspect: number, largestSize: number, out?: T): T {
  out ??= new Vector2() as unknown as T
  if (aspect > 1) {
    out.x = largestSize
    out.y = largestSize / aspect
  } else {
    out.x = largestSize * aspect
    out.y = largestSize
  }
  return out
}

/**
 * Process the svg document to create a texture with only the "fill" parts.
 */
function getFillTexture(svg: SVGSVGElement, size: number) {
  svg = svg.cloneNode(true) as SVGSVGElement
  for (const element of svg.querySelectorAll('line')) {
    element.remove()
  }
  for (const path of svg.querySelectorAll('#visual *')) {
    path.setAttribute('stroke', 'none')
    path.setAttribute('fill', '#f00')
  }
  for (const path of svg.querySelectorAll('#tech *')) {
    path.setAttribute('stroke', 'none')
    path.setAttribute('fill', '#0f0')
  }
  for (const path of svg.querySelectorAll('#baseline *')) {
    path.remove()
  }
  return svgToTexture(svg.outerHTML, size, size)
}

/**
 * 
 */
function getStrokeTexture(svg: SVGSVGElement, size: number) {
  svg = svg.cloneNode(true) as SVGSVGElement
  const strokeWidth = (.5).toString()
  for (const element of svg.querySelectorAll('line, path')) {
    element.setAttribute('stroke', '#fff')
    element.setAttribute('fill', 'none')
    element.setAttribute('stroke-width', strokeWidth)
  }
  for (const path of svg.querySelectorAll('#baseline *')) {
    path.setAttribute('stroke', 'none')
    path.setAttribute('fill', '#fff')
  }
  return svgToTexture(svg.outerHTML, size, size)
}

export class HomeText extends Group {
  imageFill: Texture
  imageStroke: Texture

  state = {
    /**
     * Whether the water simulation is playing or paused.
     */
    playing: true,
    /**
     * Whether to update the simulation only on next frame (when `playing` is false).
     */
    nextFrame: false,
  }

  constructor() {
    super()
    this.name = 'home-text'

    const svgLoader = new SVGLoader()
    const result = svgLoader.parse(homeTextSvg)

    const svg = result.xml as unknown as SVGSVGElement
    const width = svg.width.baseVal.value
    const height = svg.height.baseVal.value
    const scalar = 10 / Math.max(width, height)

    const geometries = result.paths
      .flatMap(path => path.toShapes(true))
      .map(shape => new ShapeGeometry(shape))

    const geometry = BufferGeometryUtils.mergeGeometries(geometries, false)
      .translate(-width / 2, -height / 2, 0)
      .scale(scalar, -scalar, 1)

    flipNormals(geometry)

    const IMAGE_SIZE = 2048 * 2
    this.imageFill = getFillTexture(svg, IMAGE_SIZE)
    this.imageStroke = getStrokeTexture(svg, IMAGE_SIZE)
  }

  *initialize(three: ThreeWebGLContext, responsive: Responsive): Generator<Destroyable, this> {
    const waterPointer = new Vector2()
    const WATER_SIZE = three.aspect >= 1 ? WATER_SIZE_DESKTOP : WATER_SIZE_MOBILE
    const waterSize = applyAspect(1, WATER_SIZE)
    const water = new GpuComputeWaterDemo({ size: waterSize, viscosity: VISCOSITY, damping: 1 })
      .initialize(three.renderer)

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), this)

    const uniforms = {
      uTime: { value: 0 },
      uViewportSize: { value: new Vector2() },
      uWaterMap: { value: water.currentTexture() },
      uImageFill: { value: this.imageFill },
      uImageStroke: { value: this.imageStroke },
      uScale: { value: .7 },
      uNormalMap: { value: anyLoader.loadTexture('../assets/textures/paper002_1K_NormalGL.jpg') },
    }

    uniforms.uNormalMap.value.wrapS = uniforms.uNormalMap.value.wrapT = RepeatWrapping

    plane.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .defines({ USE_UV: '' })
      .fragment.top(
        glsl_utils,
        glsl_ramp,
        glsl_blending,
        glsl_stegu_snoise,
        glsl_easings,
        glsl_texture_bicubic,
      )
      .fragment.after('map_fragment', /* glsl */`
        float aspect = uViewportSize.x / uViewportSize.y;
        // vec2 imageUv = (vUv - 0.5) / vec2(1.0, aspect) + 0.5;
        vec2 imageUv = (vUv - 0.5) * vec2(aspect, 1.0) / uScale + 0.5;
        vec4 stroke = texture2D(uImageStroke, imageUv);
        vec4 fill = texture2D(uImageFill, imageUv);
        float inside = mix(0.0, 1.0, max(stroke.a, fill.a));

        // water is sampled with bicubic filtering for smoother look
        // vec4 water = textureBicubic(uWaterMap, vUv + 0.05 * inside);
        vec4 water = textureBicubic(uWaterMap, mix(vUv, oneMinus(scaleAround(vUv, vec2(0.5), 2.0)), fill.a));

        float variation = spow(water.r * 0.1, 5.0) / 400.0;
        variation = slimited(variation, 1.0);
        Vec3Ramp r = ramp(0.5 + variation * 0.5, 
          ${vec3('#ff773dff')} * 4.0, 
          ${vec3('#eadc73ff')}, 
          ${vec3('#000000')}, 
          ${vec3('#c3ff7aff')},
          ${vec3('#71ebcaff')} * 1.5);
        diffuseColor.rgb = mix(r.a, r.b, r.t);

        // Add some fake lighting
        vec2 normalUvOffset = vec2(hash(uTime), hash(uTime * 2.0));
        vec3 normalMap = texture2D(uNormalMap, imageUv * 1.0 + normalUvOffset).xyz * 2.0 - 1.0;
        normalMap.y *= -1.0;
        vec3 normal = normalize(vec3(normalMap.xy, 1.0));
        vec3 lightDir = normalize(vec3(-1.0, 1.0, -1.0));
        float light = clamp01(dot(normal, lightDir) * 0.5 + 0.5);
        float dimLight = easeInOut(light, 10.0, 0.95) * oneMinus(length(imageUv - 0.5));
        diffuseColor.rgb *= vec3(1.0 - dimLight * 150.0);
        diffuseColor.rgb += dimLight;

        float strokeVisibilityIdle = pow(inverseLerp(-1.2, 1.0, snoise(vec3(imageUv * 0.8, uTime * 0.2))) 
          * inverseLerp(-1.2, 1.0, snoise(vec3(imageUv * 1.8 + 1.2, uTime * 0.2))), 2.0);
        float strokeVisibilityMove = clamp01(pow(abs(water.r) * 0.2, 8.0) * 0.05);
        float strokeVisibility = stroke.a * max(strokeVisibilityIdle, strokeVisibilityMove);
        diffuseColor.rgb = screenBlending(diffuseColor.rgb, vec3(1.0) * strokeVisibility);

        diffuseColor.rgb = pow(oneMinus(diffuseColor.rgb), vec3(6.0));
        diffuseColor.rgb *= vec3(oneMinus(pow(oneMinus(light), 1.75)));

        diffuseColor.a = 1.0;
      `)


    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    yield handleKeyboard([
      [{ code: 'Space' }, () => this.state.playing = !this.state.playing],
      [{ code: /Arrow/ }, () => this.state.nextFrame = true],
    ])

    const delta = new Vector3()
    const p0 = three.pointer.intersectPlane('xy', { oldFactor: 1 }).clone()
    const p1 = three.pointer.intersectPlane('xy', { oldFactor: 0 }).clone()
    yield three.onTick(tick => {
      if (this.state.playing === false && this.state.nextFrame === false)
        return

      this.state.nextFrame = false

      const scale = three.aspect >= 1 ? 1 : .7
      uniforms.uScale.value = scale

      uniforms.uTime.value += tick.deltaTime

      const { realSize } = controls.dampedVertigo.state
      uniforms.uViewportSize.value.set(realSize.width, realSize.height)

      water.damping = three.pointer.buttonDown() ? 1 : DAMPING_IDLE

      p0.copy(three.pointer.intersectPlane('xy', { oldFactor: 1 }))
      p1.copy(three.pointer.intersectPlane('xy', { oldFactor: 0 }))
      if (p0.intersected && p1.intersected) {
        delta.subVectors(p1.point!, p0.point!)
      } else {
        delta.set(0, 0, 0)
      }
      const velocity = clamp(delta.length() / tick.deltaTime, 0, 50)

      /**
       * Sub-sampling the water simulation for constant behavior at different framerate.
       */
      const SUBSAMPLING = clamp(Math.round(80 / three.averageFps), 1, 5)
      for (let index = 0; index < SUBSAMPLING; index++) {
        const i = three.pointer.intersectPlane('xy', { oldFactor: index / SUBSAMPLING })
        if (i.intersected) {
          waterPointer.set(
            inverseLerp(-realSize.width / 2, realSize.width / 2, i.point.x),
            inverseLerp(-realSize.height / 2, realSize.height / 2, i.point.y))
        }

        const WATER_SIZE = three.aspect >= 1 ? WATER_SIZE_DESKTOP : WATER_SIZE_MOBILE
        applyAspect(realSize.x / realSize.y, WATER_SIZE, waterSize)

        const isTouch = responsive.layoutObs.value.pointerType === 'touch'
        const radius = isTouch || three.pointer.buttonDown()
          ? WATER_SIZE / 10
          : lerpUnclamped(0, WATER_SIZE / 4, inverseLerpUnclamped(3, 40, velocity))
        const strength = isTouch
          ? (three.pointer.buttonDown() ? 1 : 0)
          : 1
        water.setSize(waterSize)
        water.pointer(waterPointer.x, waterPointer.y, radius, -strength)
        water.update(tick.deltaTime / SUBSAMPLING)
      }
      uniforms.uWaterMap.value = water.currentTexture()

      plane.scale.set(realSize.width, realSize.height, 1)
    })

    return this
  }
}
