import { DoubleSide, InstancedBufferAttribute, InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector2, Vector4 } from 'three'

import { fromVector2Declaration, Vector2Declaration } from 'some-utils-three/declaration'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { addTo } from 'some-utils-three/utils/parenting'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { glsl_uv_size } from 'some-utils-ts/glsl/uv-size'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'
import { Vector2Like } from 'some-utils-ts/types'

import { LineHelper } from './LineHelper'

class ScatteredBasicMaterial extends MeshBasicMaterial {
  internal = {
    uniforms: {
      // (aspect, sizeMode, align-x, align-y)
      uMapInfo: { value: new Vector4(1, 1, .5, .5) },
      // (width, height, _, _)
      uScatteredInfo: { value: new Vector4(1, 1, 0, 0) },
      uTime: Ticker.get('three').uTime,
    }
  }

  get mapAspect() { return this.internal.uniforms.uMapInfo.value.x }
  set mapAspect(value) { this.internal.uniforms.uMapInfo.value.x = value }

  getScatteredSize(out: Vector2Like = new Vector2()) {
    out.x = this.internal.uniforms.uScatteredInfo.value.x
    out.y = this.internal.uniforms.uScatteredInfo.value.y
    return out
  }
  setScatteredSize(value: Vector2Like) {
    this.internal.uniforms.uScatteredInfo.value.x = value.x
    this.internal.uniforms.uScatteredInfo.value.y = value.y
  }
  get scatteredSize() { return this.getScatteredSize() }
  set scatteredSize(value) { this.setScatteredSize(value) }

  constructor() {
    super({
      side: DoubleSide,
    })
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.internal.uniforms)
      .vertex.top(
        glsl_uv_size)
      .vertex.top(/* glsl */`
        attribute vec4 aRectUv;
      `)
      .vertex.replace('uv_vertex', /* glsl */`
        #if defined( USE_UV ) || defined( USE_ANISOTROPY )
          vUv = vec3( uv, 1 ).xy;
        #endif
        #ifdef USE_MAP
          vec2 instanceUv = aRectUv.xy + aRectUv.zw * MAP_UV;

          // vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale
          float outerAspect = uScatteredInfo.x / uScatteredInfo.y;
          float innerAspect = uMapInfo.x;
          float sizeMode = uMapInfo.y;
          vec2 align = uMapInfo.zw;
          instanceUv = applyUvSize(instanceUv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));
          
          vMapUv = ( mapTransform * vec3( instanceUv, 1 ) ).xy;
        #endif
      `)
  }
}

class DistributionNode {
  constructor(
    public space: Space,
    public rect: Rectangle,
    public uvRect: Rectangle,
    public scatterCoeff: number,
  ) { }
}

type DistributionProps = typeof Distribution.defaultProps

class Distribution {
  static defaultProps = {
    seed: <number | string>87654,
    position: <Vector2Declaration>new Vector2(0, 0),
    size: <Vector2Declaration>new Vector2(3, 2),
    scatterPadding: 0.1,
    sizeOptions: <[number, number][]>[
      [.5, 1],
      [1, 10],
      [2, 2],
      [3, 1],
    ],
  }

  props: Readonly<DistributionProps>
  root: Space
  nodes: DistributionNode[]

  constructor(scatteredPlane: ScatteredPlane, props: Partial<DistributionProps>) {
    this.props = { ...Distribution.defaultProps, ...props }

    const { position, size, scatterPadding, sizeOptions, seed } = this.props
    const { col, row } = scatteredPlane.props

    PRNG.seed(seed)

    const sizePicker = PRNG.createPicker(sizeOptions)
    const colSizes = Array.from({ length: col }).map(sizePicker)
    const rowSizes = Array.from({ length: row }).map(sizePicker)

    const { x: px, y: py } = fromVector2Declaration(position)
    const { x: sx, y: sy } = fromVector2Declaration(size)
    const root = new Space(Direction.Horizontal)
      .setSize(sx, sy)
      .setOffset(px - sx / 2, py - sy / 2)

    for (const colSize of colSizes) {
      const colSpace = new Space(Direction.Vertical)
        .setSize(`${colSize}fr`)
        .addTo(root)

      for (const rowSize of rowSizes) {
        new Space(Direction.Horizontal)
          .setSize(`${rowSize}fr`)
          .addTo(colSpace)
      }
    }

    root.computeLayout()

    const rootRect = root.rect

    const spaces = [...root.allLeaves({ includeSelf: false })]
    const halfManhattanSize = (sx + sy) / 2
    const nodes = spaces.map(space => {
      const rect = space.rect.clone()
      const uvRect = rect.clone().relativeTo(rootRect)
      const { x, y } = rect.getCenter()
      const manhattanDistance = Math.abs(x - px) + Math.abs(y - py)
      const scatterCoeff = inverseLerp(.5, 1, manhattanDistance / halfManhattanSize)
      rect.centerX += PRNG.between(-scatterPadding, scatterPadding) * scatterCoeff
      rect.centerY += PRNG.between(-scatterPadding, scatterPadding) * scatterCoeff
      return {
        space,
        rect,
        uvRect,
        scatterCoeff,
      }
    })

    this.root = root
    this.nodes = nodes
  }
}

type ScatteredPlaneProps = typeof ScatteredPlane.defaultProps

export class ScatteredPlane extends Object3D {
  static displayName = 'ScatteredPlane'

  static defaultProps = {
    row: 20,
    col: 30,
    imageAspect: 1,
    imageResizeMode: <'contain' | 'cover'>'cover',
  }

  readonly props: Readonly<ScatteredPlaneProps>

  internal: {
    count: number
    mesh: InstancedMesh<PlaneGeometry, ScatteredBasicMaterial>
    aRectUv: InstancedBufferAttribute
    lineHelper: LineHelper
  }

  get count() { return this.internal.count }

  static transition_meta = 'Range(0, 1)'
  transition = 0

  constructor(props: Partial<ScatteredPlaneProps> = {}) {
    super()
    this.props = { ...ScatteredPlane.defaultProps, ...props }

    const { row, col } = this.props
    const count = row * col
    const geometry = new PlaneGeometry()
    const material = new ScatteredBasicMaterial()
    const mesh = new InstancedMesh(geometry, material, count)
    addTo(mesh, this)

    const aRectUv = new InstancedBufferAttribute(new Float32Array(count * 4), 4)
    mesh.geometry.setAttribute('aRectUv', aRectUv)

    const lineHelper = new LineHelper()
    addTo(lineHelper, this)

    this.internal = { count, mesh, aRectUv, lineHelper }

    this.distribute(this.getDistribution())
  }

  getDistribution(props: Partial<DistributionProps> = {}) {
    return new Distribution(this, props)
  }

  drawDistribution(distribution: Distribution) {
    const { position, size, scatterPadding } = distribution.props
    const { x: px, y: py } = fromVector2Declaration(position)
    const { x: sx, y: sy } = fromVector2Declaration(size)
    this.internal.lineHelper
      .drawRect([px, py, sx, sy])
      .drawRect([px, py, sx + scatterPadding * 2, sy + scatterPadding * 2])
  }

  distribute(distribution: Distribution) {
    const { count, mesh, aRectUv } = this.internal
    for (let i = 0; i < count; i++) {
      const { rect, uvRect } = distribution.nodes[i]
      mesh.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(),
        scale: rect.getSize(),
      }))
      aRectUv.setXYZW(i, uvRect.x, uvRect.y, uvRect.width, uvRect.height)
    }
    mesh.material.setScatteredSize(distribution.root.rect.getSize())
  }

  lerpDistribute(distribution0: Distribution, distribution1: Distribution, t: number) {
    const { count, mesh, aRectUv } = this.internal
    const rect = new Rectangle()
    const uvRect = new Rectangle()
    for (let i = 0; i < count; i++) {
      const node0 = distribution0.nodes[i]
      const node1 = distribution1.nodes[i]
      rect.lerpRectangles(node0.rect, node1.rect, t)
      uvRect.lerpRectangles(node0.uvRect, node1.uvRect, t)
      mesh.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(),
        scale: rect.getSize(),
      }))
      aRectUv.setXYZW(i, uvRect.x, uvRect.y, uvRect.width, uvRect.height)
    }
    const rootRect = new Rectangle().lerpRectangles(distribution0.root.rect, distribution1.root.rect, t)
    mesh.material.setScatteredSize(rootRect.getSize())

    mesh.instanceMatrix.needsUpdate = true
    aRectUv.needsUpdate = true
  }
}
