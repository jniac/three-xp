import { InstancedBufferAttribute, InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector2, Vector4 } from 'three'

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

import { WireRect } from './WireRect'

type DistributionProps = typeof Distribution.defaultProps

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
    super()
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

class Distribution {
  static defaultProps = {
    position: new Vector2(0, 0),
    size: new Vector2(3, 2),
    scatterPadding: 0.1,
    sizeOptions: [
      [.5, 1],
      [1, 10],
      [2, 2],
      [3, 1],
    ] as [number, number][],
  }

  props: Readonly<DistributionProps>
  root: Space
  nodes: DistributionNode[]

  constructor(scatteredPlane: ScatteredPlane, props: Partial<DistributionProps>, seed: number | string) {
    this.props = { ...Distribution.defaultProps, ...props }

    const { position, size, scatterPadding, sizeOptions } = this.props
    const { col, row } = scatteredPlane.props

    PRNG.seed(seed)

    const sizePicker = PRNG.createPicker(sizeOptions)
    const colSizes = Array.from({ length: col }).map(sizePicker)
    const rowSizes = Array.from({ length: row }).map(sizePicker)

    const root = new Space(Direction.Horizontal)
      .setSize(size.x, size.y)
      .setOffset(position.x - size.x / 2, position.y - size.y / 2)

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
    const nodes = spaces.map(space => {
      const rect = space.rect.clone()
      const uvRect = rect.clone().relativeTo(rootRect)
      const { x, y } = rect.getCenter()
      const manhattanDistance = Math.abs(x) + Math.abs(y)
      const halfManhattanSize = (size.x + size.y) / 2
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
  }

  get count() { return this.internal.count }

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

    this.internal = { count, mesh, aRectUv }

    this.distribute()
  }

  distribute(props: Partial<DistributionProps> = {}) {
    const distribution = new Distribution(this, props, ScatteredPlane.name)
    const { count, mesh, aRectUv } = this.internal
    for (let i = 0; i < count; i++) {
      const { rect, uvRect } = distribution.nodes[i]
      mesh.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(),
        scale: rect.getSize(),
      }))
      aRectUv.setXYZW(i, uvRect.x, uvRect.y, uvRect.width, uvRect.height)
      // mesh.setColorAt(i, makeColor(`hsl(${PRNG.between(240, 360)}, 100%, 50%)`))
    }
    mesh.material.setScatteredSize(distribution.root.rect.getSize())

    const { size, scatterPadding } = distribution.props
    addTo(new WireRect(size.x, size.y), this)
    addTo(new WireRect(size.x + scatterPadding * 2, size.y + scatterPadding * 2), this)
  }
}
