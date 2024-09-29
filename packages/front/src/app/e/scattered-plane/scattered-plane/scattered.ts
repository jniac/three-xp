import { DirectionalLight, DoubleSide, HemisphereLight, InstancedBufferAttribute, InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector2, Vector3, Vector4 } from 'three'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { addTo } from 'some-utils-three/utils/tree'
import { glsl_uv_size } from 'some-utils-ts/glsl/uv-size'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { Ticker } from 'some-utils-ts/ticker'
import { Vector2Like } from 'some-utils-ts/types'

import { LineHelper } from '../LineHelper'

import { Distribution, DistributionProps } from './distribution'
import { ScatteredPlaneLines } from './lines'

class LightSetup extends Object3D {
  constructor() {
    super()
    const sky = new HemisphereLight('#ffffff', '#926969', 1)
    this.add(sky)

    const sun = new DirectionalLight('#ffffff', 2)
    this.add(sun)
    sun.position.set(2, 4, 1)
  }
}

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

export type ScatteredPlaneProps = typeof ScatteredPlane.defaultProps

export class ScatteredPlane extends Object3D {
  static displayName = 'ScatteredPlane'

  static defaultProps = {
    row: 20,
    col: 30,
    imageAspect: 1,
    imageResizeMode: <'contain' | 'cover'>'cover',
  }

  static createPlane(props: ScatteredPlaneProps) {
    const { row, col } = props
    const count = row * col

    const geometry = new PlaneGeometry()
    const aRectUv = new InstancedBufferAttribute(new Float32Array(count * 4), 4)
    geometry.setAttribute('aRectUv', aRectUv)

    const material = new ScatteredBasicMaterial()
    const mesh = new InstancedMesh(geometry, material, count)
    mesh.name = 'plane'

    return mesh
  }

  readonly props: Readonly<ScatteredPlaneProps>

  internal: {
    count: number
    plane: InstancedMesh<PlaneGeometry, ScatteredBasicMaterial>
    lines: ScatteredPlaneLines
    lineHelper: LineHelper
    lightSetup: LightSetup
  }

  get count() { return this.internal.count }

  static transition_meta = 'Range(0, 1)'
  transition = 0

  constructor(incomingProps: Partial<ScatteredPlaneProps> = {}) {
    super()
    const props = { ...ScatteredPlane.defaultProps, ...incomingProps }

    const { col, row } = props
    const count = row * col

    const plane = ScatteredPlane.createPlane(props)
    addTo(plane, this)

    const lines = new ScatteredPlaneLines(props)
    addTo(lines, this)

    const lineHelper = new LineHelper()
    addTo(lineHelper, this)

    const lightSetup = new LightSetup()
    addTo(lightSetup, this)

    this.internal = { count, plane, lineHelper, lines, lightSetup }
    this.props = props

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
    const { count, plane } = this.internal
    const { aRectUv } = plane.geometry.attributes
    for (let i = 0; i < count; i++) {
      const { rect, uvRect } = distribution.nodes[i]
      plane.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(),
        scale: rect.getSize(),
      }))
      aRectUv.setXYZW(i, uvRect.x, uvRect.y, uvRect.width, uvRect.height)
    }
    plane.material.setScatteredSize(distribution.root.rect.getSize())
  }

  lerpDistribute(distribution0: Distribution, distribution1: Distribution, t: number) {
    const { count, plane, lines } = this.internal
    const { aRectUv } = plane.geometry.attributes

    const rect = new Rectangle()
    const uvRect = new Rectangle()
    const v0 = new Vector3()
    const v1 = new Vector3()

    for (let i = 0; i < count; i++) {
      const node0 = distribution0.nodes[i]
      const node1 = distribution1.nodes[i]
      rect.lerpRectangles(node0.rect, node1.rect, t)
      uvRect.lerpRectangles(node0.uvRect, node1.uvRect, t)
      plane.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(v0),
        scale: rect.getSize(v1),
      }))
      aRectUv.setXYZW(i, uvRect.x, uvRect.y, uvRect.width, uvRect.height)

      makeMatrix4({ position: node0.rect.getCenter(v0) })
        .toArray(lines.parts.aStartMat.array, i * 16)
      makeMatrix4({ position: node1.rect.getCenter(v0) })
        .toArray(lines.parts.aEndMat.array, i * 16)
    }

    const rootRect = new Rectangle().lerpRectangles(distribution0.root.rect, distribution1.root.rect, t)
    plane.material.setScatteredSize(rootRect.getSize())

    plane.instanceMatrix.needsUpdate = true
    aRectUv.needsUpdate = true

    lines.parts.aStartMat.needsUpdate = true
    lines.parts.aEndMat.needsUpdate = true
  }
}
