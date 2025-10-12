import { DataTexture, Group, LinearFilter, LinearMipMapLinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, ShapeGeometry, Texture, Vector2 } from 'three'
import { BufferGeometryUtils, SVGLoader } from 'three/examples/jsm/Addons.js'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'
import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { flipNormals } from 'some-utils-three/utils/geometry/normals'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_blending } from 'some-utils-ts/glsl/blending'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { promisify } from 'some-utils-ts/misc/promisify'

import { homeTextSvg } from './home-text.svg'

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

export class HomeText extends Group {
  imageFill: Texture
  imageStroke: Texture

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
    const [path0, path1] = svg.querySelectorAll('path')
    {
      // fill
      path0.setAttribute('stroke', 'none')
      path0.setAttribute('fill', '#f00')
      path1.setAttribute('stroke', 'none')
      path1.setAttribute('fill', '#00f')
      this.imageFill = svgToTexture(svg.outerHTML, IMAGE_SIZE, IMAGE_SIZE)
    }
    {
      // stroke
      const strokeWidth = (.5).toString()
      path0.setAttribute('stroke', '#000')
      path0.setAttribute('fill', 'none')
      path0.setAttribute('stroke-width', strokeWidth)
      path1.setAttribute('stroke', '#000')
      path1.setAttribute('fill', 'none')
      path1.setAttribute('stroke-width', strokeWidth)
      this.imageStroke = svgToTexture(svg.outerHTML, IMAGE_SIZE, IMAGE_SIZE)
    }
  }

  initialize(three: ThreeWebGLContext): this {
    const WATER_SIZE = 100

    const waterPointer = new Vector2()
    const waterSize = applyAspect(1, WATER_SIZE)
    const water = new GpuComputeWaterDemo({ size: waterSize, viscosity: 0.995 })
      .initialize(three.renderer)

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), this)

    const uniforms = {
      uViewportSize: { value: new Vector2() },
      uWater: { value: water.currentTexture() },
      uImageFill: { value: this.imageFill },
      uImageStroke: { value: this.imageStroke },
    }

    plane.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .defines({ USE_UV: '' })
      .fragment.top(
        glsl_utils,
        glsl_ramp,
        glsl_blending,
      )
      .fragment.after('map_fragment', /* glsl */`
        float aspect = uViewportSize.x / uViewportSize.y;
        vec2 imageUv = (vUv - 0.5) / vec2(1.0, aspect) + 0.5;
        vec4 stroke = texture2D(uImageStroke, imageUv);
        vec4 fill = texture2D(uImageFill, imageUv);
        float inside = mix(0.0, 1.0, max(stroke.a, fill.a));
        vec4 water = texture2D(uWater, vUv + 0.05 * inside);

        Vec3Ramp r = ramp(0.5 + spow(water.r * 0.1, 4.0) * 0.2, ${vec3('#eadc73ff')}, ${vec3('#000000')}, ${vec3('#71ebcaff')});
        diffuseColor.rgb = mix(r.a, r.b, r.t);
        diffuseColor.rgb = screenBlending(diffuseColor.rgb, clamp01(vec3(stroke.a) * pow(abs(water.r) * 0.2, 8.0) * 0.05));
        diffuseColor.a = 1.0;
      `)


    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    three.onTick({ frameDelay: 2 }, tick => {
      const { realSize } = controls.dampedVertigo.state
      uniforms.uViewportSize.value.set(realSize.width, realSize.height)

      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        waterPointer.set(
          inverseLerp(-realSize.width / 2, realSize.width / 2, i.point.x),
          inverseLerp(-realSize.height / 2, realSize.height / 2, i.point.y))
      }

      applyAspect(realSize.x / realSize.y, WATER_SIZE, waterSize)
      water.setSize(waterSize)
      water.pointer(waterPointer.x, waterPointer.y, 5, three.pointer.buttonDown() ? 1 : 0)
      water.update(tick.deltaTime)
      uniforms.uWater.value = water.currentTexture()

      plane.scale.set(realSize.width, realSize.height, 1)
    })

    return this
  }
}
