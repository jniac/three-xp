import { CanvasTexture, Group, Mesh, MeshBasicMaterial, PlaneGeometry, ShapeGeometry, Texture, Vector2 } from 'three'
import { BufferGeometryUtils, SVGLoader } from 'three/examples/jsm/Addons.js'

import { GpuComputeWaterDemo } from 'some-utils-three/experimental/gpu-compute/demo/water'
import { flipNormals } from 'some-utils-three/utils/geometry/normals'
import { setup } from 'some-utils-three/utils/tree'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { homeTextSvg } from './home-text.svg'

function svgToTexture(svg: any, width = 512, height = 512) {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const img = new Image()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  return new Promise<Texture>((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      const texture = new CanvasTexture(canvas)
      resolve(texture)
    }
    img.onerror = reject
    img.src = url
  })
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

    setup(new Mesh(geometry, new MeshBasicMaterial({})), this)

    for (const path of svg.querySelectorAll('path')) {
      path.setAttribute('stroke', 'red')
    }
    svgToTexture(svg.outerHTML, 2048, 2048)
      .then(texture => {
        const material = new MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
        })
        setup(new Mesh(new PlaneGeometry(10, 10), material), this)
      })
  }

  initialize(three: ThreeWebGLContext): this {
    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), this)

    const waterPointer = new Vector2()
    const waterSize = applyAspect(1, 512)
    const water = new GpuComputeWaterDemo({ size: waterSize })
      .initialize(three.renderer)

    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    three.onTick(tick => {
      const { realSize } = controls.dampedVertigo.state

      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        waterPointer.set(
          inverseLerp(-realSize.width / 2, realSize.width / 2, i.point.x),
          inverseLerp(-realSize.height / 2, realSize.height / 2, i.point.y))
      }

      applyAspect(realSize.x / realSize.y, 512, waterSize)
      water.setSize(waterSize)
      water.pointer(waterPointer.x, waterPointer.y, 20, 1)
      water.update(tick.deltaTime)

      plane.scale.set(realSize.width, realSize.height, 1)
      plane.material.map = water.currentTexture()
    })

    return this
  }
}
