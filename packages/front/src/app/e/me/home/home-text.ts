import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, ShapeGeometry, Texture, Vector2, Vector3, Vector4 } from 'three'
import { BufferGeometryUtils, SVGLoader } from 'three/examples/jsm/Addons.js'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
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
import { glsl_sdf2d } from 'some-utils-ts/glsl/sdf-2d'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_texture_bicubic } from 'some-utils-ts/glsl/texture-bicubic'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { clamp, inverseLerp, inverseLerpUnclamped, lerpUnclamped, remapUnclamped } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { Message } from 'some-utils-ts/message'
import { Destroyable } from 'some-utils-ts/types'

import { Responsive } from '../responsive'
import { floatBufferToBase64 } from './float-buffer-utils'
import { homeTextSvg } from './home-text-b.svg'
import { getFillTexture, getStrokeTexture } from './texture'

const WATER_SIZE_DESKTOP = 120 * 3
const WATER_SIZE_MOBILE = 80 * 3
const VISCOSITY = .995
const DAMPING_IDLE = .995

function applyAspect<T extends { x: number, y: number } = Vector2>(
  aspect: number,
  largestSize: number,
  out?: T,
): T {
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

export class HomeText extends Group {
  imageFill: Texture
  imageStroke: Texture
  toggleRect: Rectangle

  state = {
    /**
     * Whether the water simulation is playing or paused.
     */
    playing: true,
    /**
     * Whether to update the simulation only on next frame (when `playing` is false).
     */
    nextFrame: false,
    /**
     * Whether to automatically move the water simulation.
     */
    autoMove: false,
    autoMoveState: 0,
  }

  // Canceled (in favor of procedural auto-move)
  // autoMovePointerBuffer = base64ToFloatBuffer(pointerRecording1)
  recordingPointerBuffer = <number[]>[]

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

    const toggleRectElement = svg.querySelector('#toggle rect') as SVGRectElement
    this.toggleRect = new Rectangle(
      toggleRectElement.x.baseVal.value,
      toggleRectElement.y.baseVal.value,
      toggleRectElement.width.baseVal.value,
      toggleRectElement.height.baseVal.value)
      .relativeTo({ x: 0, y: 0, width, height })
      .mirrorY(1)

    // this.toggleRect.y = 1 - this.toggleRect.y - this.toggleRect.height
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
      uScale: { value: 1.9 },
      uToggleRect: { value: new Vector4(...this.toggleRect) },
      uToggleValue: { value: 0 },
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
        glsl_sdf2d,
      )
      .fragment.top(/* glsl */`
        struct Toggle {
          float roundedRectSdf;
          float thumbSdf;
        };

        Toggle computeToggle(vec2 uv) {
          Toggle toggle;

          vec2 size = uToggleRect.zw;
          float radius = size.y * 0.5;
          vec2 center = uToggleRect.xy + size * 0.5;
          toggle.roundedRectSdf = sdRoundedBox(uv - center, size * 0.5, vec4(radius));

          float deltaX = size.x - size.y;
          float onOff = easeInOut(uToggleValue, 4.0, 0.5);
          vec2 thumbCenter = uToggleRect.xy + vec2(radius) + vec2(deltaX * onOff, 0.0);
          toggle.thumbSdf = sdCircle(uv - thumbCenter, radius *  0.75);

          return toggle;
        }
      `)
      .fragment.after('map_fragment', /* glsl */`
        float aspect = uViewportSize.x / uViewportSize.y;
        // vec2 imageUv = (vUv - 0.5) / vec2(1.0, aspect) + 0.5;
        vec2 imageUv = (vUv - 0.5) * vec2(aspect, 1.0) / uScale + 0.5;
        vec4 stroke = texture2D(uImageStroke, imageUv);
        vec4 fill = texture2D(uImageFill, imageUv);
        float inside = fill.a;

        Toggle toggle = computeToggle(imageUv);

        // water is sampled with bicubic filtering for smoother look
        // vec4 water = textureBicubic(uWaterMap, vUv + 0.05 * inside);
        vec2 outsideUv = vUv;
        vec2 insideUv = scaleAround(vUv, vec2(0.4), 1.4);
        insideUv.x = oneMinus(insideUv.x);
        // insideUv.y = oneMinus(insideUv.y);
        vec4 water = textureBicubic(uWaterMap, mix(outsideUv, insideUv, fill.a));

        float variation = spow(water.r * 0.1, 5.0) / 400.0;
        variation = slimited(variation, 1.0);
        Vec3Ramp r = ramp(0.5 + variation * 0.45, 
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

        float strokeVisibilityIdle = 0.2 + pow(inverseLerp(-1.2, 1.0, snoise(vec3(imageUv * 2.8, uTime * 0.2))) 
          * inverseLerp(-1.2, 1.0, snoise(vec3(imageUv * 1.8 + 1.2, uTime * 0.2))), 1.5);
        float strokeVisibilityMove = clamp01(pow(abs(water.r) * 0.2, 8.0) * 0.25);
        float strokeVisibility = stroke.r * max(strokeVisibilityIdle, strokeVisibilityMove);
        diffuseColor.rgb = screenBlending(diffuseColor.rgb, vec3(1.0) * strokeVisibility);

        diffuseColor.rgb = pow(oneMinus(diffuseColor.rgb), vec3(6.0));
        diffuseColor.rgb *= vec3(oneMinus(pow(oneMinus(light), 1.75)));

        // float sdf = opOnion(toggle.thumbSdf + -mod(uTime, 1.0) * 0.01, 0.0);
        // sdf = 1.0 - smoothstep(0.002, 0.0, sdf);
        // diffuseColor.rgb *= vec3(sdf, sdf, 1.0);

        float thumb = smoothstep(0.0005, 0.0, toggle.thumbSdf);
        vec3 thumbColorOff = mix(${vec3('#ff0008ff')}, ${vec3('#000000')}, 1.0 - easeInOut(sin01(uTime * 0.5), 6.0, 0.95));
        vec3 thumbColorOn = pow(${vec3('#2500AD')}, vec3(2.2));
        vec3 thumbColor = mix(thumbColorOff, thumbColorOn, easeInOut(uToggleValue, 4.0, 0.5));
        diffuseColor.rgb = mix(diffuseColor.rgb, thumbColor, thumb);

        diffuseColor.a = 1.0;

        // debug
        // diffuseColor = stroke;
        // diffuseColor = fill;
        // diffuseColor.rgb = vec3(fill.a);
      `)

    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    let recordingPointer = false
    const startRecordingPointer = () => {
      recordingPointer = true
      console.log('started recording pointer data')
      this.recordingPointerBuffer = []
    }
    const stopRecordingPointer = () => {
      recordingPointer = false
      const str = floatBufferToBase64(this.recordingPointerBuffer)
      console.log('recording pointer data:')
      console.log(str)
      // copy to clipboard
      navigator.clipboard.writeText(str)
      this.recordingPointerBuffer = []
    }
    const toggleRecordingPointer = () => {
      if (recordingPointer) {
        stopRecordingPointer()
      } else {
        startRecordingPointer()
      }
    }

    yield handleKeyboard([
      [{ code: 'Space' }, () => this.state.playing = !this.state.playing],
      [{ code: /Arrow/ }, () => this.state.nextFrame = true],
      [{ code: 'KeyR', modifiers: 'shift' }, toggleRecordingPointer],
    ])

    yield handlePointer(three.domElement, {
      onTap: () => {
        this.state.autoMove = !this.state.autoMove
      },
    })

    const delta = new Vector3()
    const p0 = three.pointer.intersectPlane('xy', { oldFactor: 1 }).clone()
    const p1 = three.pointer.intersectPlane('xy', { oldFactor: 0 }).clone()
    yield three.onTick(tick => {
      if (this.state.playing === false && this.state.nextFrame === false)
        return

      this.state.nextFrame = false

      const scale = three.aspect > 1 ? 1 : remapUnclamped(three.aspect, 1, 390 / 663, .85, .64)
      uniforms.uScale.value = scale * 1.25

      uniforms.uTime.value += tick.deltaTime

      uniforms.uToggleValue.value += ((this.state.autoMove ? 1 : 0) - uniforms.uToggleValue.value) * clamp(tick.deltaTime * 5, 0, 1)

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
          : lerpUnclamped(0, WATER_SIZE / 10, Math.max(0, inverseLerpUnclamped(3, 20, velocity)) ** .5)
        const strength = isTouch
          ? (three.pointer.buttonDown() ? 1 : 0)
          : 1
        water.setSize(waterSize)
        water.pointer(waterPointer.x, waterPointer.y, radius, -strength)

        if (this.state.autoMove) {
          // Canceled (in favor of procedural auto-move):
          // const i4 = this.state.autoMoveIndex * 4
          // const x = this.autoMovePointerBuffer[i4 + 0]
          // const y = this.autoMovePointerBuffer[i4 + 1]
          // const r = this.autoMovePointerBuffer[i4 + 2]
          // const s = this.autoMovePointerBuffer[i4 + 3]
          // water.pointer(x, y, r, s)

          // this.state.autoMoveIndex++
          // if ((this.state.autoMoveIndex + 1) * 4 >= this.autoMovePointerBuffer.length) {
          //   this.state.autoMoveIndex = 0
          // }

          // Cheap slow-mo for auto-move:
          if (tick.frame % 4 > 0)
            return

          // Procedural auto-move:
          const t = this.state.autoMoveState * 2
          const a1 = t * .5
          const x1 = .16 * Math.cos(a1)
          const y1 = .16 * Math.sin(a1 * 2)
          const a2 = t * 2
          const x2 = .02 * Math.cos(a2)
          const y2 = .02 * Math.sin(a2)
          const x = .5 + x1 + x2
          const y = .5 + y1 + y2
          const r = WATER_SIZE / 10
          const s = -1
          water.pointer(x, y, r, s)

          this.state.autoMoveState += 1 / 50
        }

        water.update(tick.deltaTime / SUBSAMPLING)

        if (recordingPointer) {
          this.recordingPointerBuffer.push(waterPointer.x, waterPointer.y, radius, -strength)
          if (this.recordingPointerBuffer.length >= 4000) {
            stopRecordingPointer()
          }
        }
      }
      uniforms.uWaterMap.value = water.currentTexture()

      plane.scale.set(realSize.width, realSize.height, 1)
    })

    return this
  }
}
