'use client'
import RBush from 'rbush'

import { Box3, Color, ColorRepresentation, Group, InstancedBufferAttribute, InstancedMesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry, Sphere, Vector3 } from 'three'

import { Vector3Declaration, fromVector3Declaration } from 'some-utils-three/declaration'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Rectangle, RectangleDeclaration } from 'some-utils-ts/math/geom/rectangle'
import { computeExponentialLerpFactor } from 'some-utils-ts/math/misc/exponential-lerp'
import { getRandom } from 'some-utils-ts/random/algorithm/parkmiller-c-iso'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

const _v1 = new Vector3()
const _v2 = new Vector3()
const _v3 = new Vector3()

class ColorEntry {
  color: Color
  constructor(
    public weight: number,
    public value: string,
  ) {
    this.color = makeColor(value).clone()
  }
  *[Symbol.iterator]() {
    yield this.weight
    yield this.value
  }
}

export const Colors = (() => {
  const colors = {
    darkBlue1: new ColorEntry(2, '#33099c'),
    blue: new ColorEntry(2, '#4800ff'),
    darkBlue2: new ColorEntry(.3, '#231455'),
    pink: new ColorEntry(1, '#ce51bb'),
    yellow: new ColorEntry(.3, '#c7ec33'),
  }
  const random = getRandom(123456)
  const colorValues = Object.values(colors).map(color => color.value)
  const colorWeights = Object.values(colors).map(color => color.weight)
  return {
    colors,
    randomColor: () => R.setRandom(random).pick(colorValues, colorWeights),
  }
})()

function roundWithOffset(value: number, step: number, offset: number) {
  return Math.round((value - offset) / step) * step + offset
}

type Margin = 'inner' | 'outer' | number
function fromMargin(value: Margin) {
  switch (value) {
    case 'inner':
      return -0.01
    case 'outer':
      return 0.01
    default:
      return value
  }
}

class SpawnerMaterial extends MeshBasicMaterial {
  constructor(parameters?: MeshBasicMaterialParameters) {
    super({ side: 2, ...parameters })
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .vertex.top(/* glsl */`
        attribute vec4 aInfo;
      `)
      .vertex.mainAfterAll(/* glsl */`
        gl_Position.z += 0.01 * aInfo.x; // apply z-offset for sorting
      `)
  }
}

class SpawnerInstanceMesh extends InstancedMesh {
  readonly props: Readonly<{ size: number }>

  state = {
    nextIndex: 0,
    recentlyAdded: new Set<number>(),
  }

  sizeBuffer: Float32Array
  scaleBuffer: Float32Array
  originBuffer: Float32Array
  pivotBuffer: Float32Array
  infoBuffer: Float32Array
  infoAttribute: InstancedBufferAttribute

  constructor(size: number) {
    super(
      new PlaneGeometry(1, 1),
      new SpawnerMaterial(),
      size,
    )

    this.props = { size }
    this.sizeBuffer = new Float32Array(size)
    this.scaleBuffer = new Float32Array(size)
    this.originBuffer = new Float32Array(size * 3)
    this.pivotBuffer = new Float32Array(size * 3)
    this.infoBuffer = new Float32Array(size * 4)
    this.infoAttribute = new InstancedBufferAttribute(this.infoBuffer, 4)
    this.geometry.setAttribute('aInfo', this.infoAttribute)

    // Initialize the color attribute:
    this.setColorAt(0, makeColor('#ffffff'))

    this.clear()
  }

  clear(): this {
    this.count = 0

    this.boundingBox ??= new Box3()
    this.boundingSphere ??= new Sphere()
    this.boundingBox!.makeEmpty()
    this.boundingSphere!.center.set(0, 0, 0)
    this.boundingSphere!.radius = 0

    this.instanceMatrix.array.fill(0)
    this.instanceColor!.array.fill(0)
    this.instanceMatrix.needsUpdate = true
    this.instanceColor!.needsUpdate = true

    return this
  }

  setNextInstance(
    x: number,
    y: number,
    size: number,
    pivotX: number,
    pivotY: number,
    color: ColorRepresentation,
    randomId: number,
  ): { index: number } {
    const index = this.state.nextIndex < this.props.size ? this.state.nextIndex : 0
    this.state.nextIndex = index + 1
    this.count = Math.max(index + 1, this.count)

    this.setMatrixAt(index, makeMatrix4({
      position: { x, y },
      scale: 0,
    }))
    this.sizeBuffer[index] = size
    this.originBuffer[index * 3 + 0] = x
    this.originBuffer[index * 3 + 1] = y
    this.originBuffer[index * 3 + 2] = 0
    this.pivotBuffer[index * 3 + 0] = pivotX
    this.pivotBuffer[index * 3 + 1] = pivotY
    this.pivotBuffer[index * 3 + 2] = 0
    this.scaleBuffer[index] = 0
    this.infoBuffer[index * 4 + 0] = randomId
    this.infoBuffer[index * 4 + 1] = 0 // can be used for anything, currently unused
    this.infoBuffer[index * 4 + 2] = 0 // can be used for anything, currently unused
    this.infoBuffer[index * 4 + 3] = 0 // can be used for anything, currently unused
    this.setColorAt(index, makeColor(color))
    this.instanceMatrix.needsUpdate = true
    this.instanceColor!.needsUpdate = true
    this.infoAttribute.needsUpdate = true
    this.state.recentlyAdded.add(index)

    // update bounds
    const { min, max } = this.boundingBox!
    const halfSize = size / 2
    const minX = x - halfSize
    const maxX = x + halfSize
    const minY = y - halfSize
    const maxY = y + halfSize

    min.x = Math.min(min.x, minX)
    min.y = Math.min(min.y, minY)
    max.x = Math.max(max.x, maxX)
    max.y = Math.max(max.y, maxY)
    this.boundingBox!.set(min, max)
    this.boundingSphere!.center.set(
      (min.x + max.x) / 2,
      (min.y + max.y) / 2,
      0,
    )
    this.boundingSphere!.radius = (
      Math.sqrt(
        Math.pow(max.x - min.x, 2) +
        Math.pow(max.y - min.y, 2)
      ) / 2
    )

    return { index }
  }

  update(deltaTime: number) {
    const done = new Set<number>()
    const lerpRatio = computeExponentialLerpFactor(deltaTime, { target: .9, timespan: .25 })

    const marr = this.instanceMatrix.array

    for (const index of this.state.recentlyAdded) {
      const currentScale = this.scaleBuffer[index]
      const newScale = currentScale + (1.02 - currentScale) * lerpRatio

      this.scaleBuffer[index] = newScale

      const origin = _v1.fromArray(this.originBuffer, index * 3)
      const pivot = _v2.fromArray(this.pivotBuffer, index * 3)
      const position = _v3
      let s: number

      if (newScale < 1) {
        position.copy(origin).addScaledVector(pivot, 1 - newScale)
        s = this.sizeBuffer[index] * newScale
      }

      else {
        position.copy(origin)
        s = this.sizeBuffer[index]

        done.add(index)
      }

      marr[index * 16 + 12] = position.x
      marr[index * 16 + 13] = position.y
      marr[index * 16 + 14] = position.z
      marr[index * 16 + 0] = s
      marr[index * 16 + 5] = s
      marr[index * 16 + 10] = s
    }

    for (const index of done)
      this.state.recentlyAdded.delete(index)

    this.instanceMatrix.needsUpdate = true
  }

  onTick(tick: { deltaTime: number }) {
    this.update(tick.deltaTime)
  }
}

class RectangleWithId {
  get minX() { return this.rect.min.x }
  get minY() { return this.rect.min.y }
  get maxX() { return this.rect.max.x }
  get maxY() { return this.rect.max.y }
  constructor(
    public id: number,
    public rect: Rectangle = new Rectangle(),
  ) { }
}

export class Spawner extends Group {
  static sizes = [1, .5, .25]
  static sizeWeights = [1, 2, 4]

  static Colors = Colors

  state = {
    tree: new RBush<RectangleWithId>(),
    rectanglesById: new Map<number, RectangleWithId>(),
    instances: setup(new SpawnerInstanceMesh(1_000), this),
    random: getRandom(123456),
  }

  clear(): this {
    this.state.tree.clear()
    this.state.instances.clear()
    return this
  }

  static spwanAtDefaultOptions = {
    position: <Vector3Declaration>{ x: 0, y: 0 },
    pivotSourcePosition: <Vector3Declaration | undefined>undefined,
    size: 1,
    color: <ColorRepresentation>'white',
  }
  spawnAt(options?: Partial<typeof Spawner.spwanAtDefaultOptions>) {
    const opt = { ...Spawner.spwanAtDefaultOptions, ...options }
    const { size, color } = opt

    const position = fromVector3Declaration(opt.position, _v1)
    const pivotSourcePosition = opt.pivotSourcePosition ? fromVector3Declaration(opt.pivotSourcePosition, _v2) : position
    const pivot = _v3.copy(position).sub(pivotSourcePosition).multiplyScalar(size * .5)

    const { tree, instances, rectanglesById } = this.state
    const { index } = instances.setNextInstance(position.x, position.y, size, pivot.x, pivot.y, color, this.state.random())
    const existingRect = rectanglesById.get(index)
    if (existingRect)
      tree.remove(existingRect) // remove previous rect with the same id, if exists
    const newRect = new RectangleWithId(index, Rectangle.from({ center: position, size }))
    rectanglesById.set(index, newRect)
    tree.insert(newRect)
  }

  getSize(): number {
    return R
      .setRandom(this.state.random)
      .pick(Spawner.sizes, Spawner.sizeWeights)
  }

  #queryRectangles_private = {
    rect: new Rectangle(),
  }
  queryRectangles(rectArg: RectangleDeclaration, margin: Margin = 0): Rectangle[] {
    const { tree } = this.state
    const rect = Rectangle.from(rectArg, this.#queryRectangles_private.rect)
    if (margin)
      rect.inflate(fromMargin(margin))
    return tree.search(rect).map(entry => entry.rect)
  }

  queryRectanglesAt(x: number, y: number, size = 0, margin: Margin = 0): Rectangle[] {
    return this.queryRectangles({ center: { x, y }, size }, margin)
  }

  computeRectangleAt(x: number, y: number, size: number, out?: Rectangle) {
    const step = size === Spawner.sizes.at(-1) ? size : size / 2 // the last size is the "base" size, it doesn't need to be aligned to half-steps
    const offset = size / 2
    x = roundWithOffset(x, step, offset)
    y = roundWithOffset(y, step, offset)
    return Rectangle.from({ center: { x, y }, size }, out)
  }

  searchRandomSpawnRectAt(x: number, y: number, spawnSize?: number): Rectangle | null {
    spawnSize ??= this.getSize()

    const rect = this.computeRectangleAt(x, y, spawnSize)

    const colliding = this.queryRectangles(rect, 'inner')

    if (colliding.length === 0)
      return rect

    return null
  }

  static searchRandomSpawnRectAroundDefaultOptions = {
    radiusRatioRange: <[number, number]>[0, 2],
    spawnSize: <number | undefined>undefined,
    searchCount: 10,
  }
  searchRandomSpawnRectAroundStats = {
    totalSearches: 0,
    successfulSearches: 0,
    bySize: {
      totalSearches: new Map<number, number>(),
      successfulSearches: new Map<number, number>(),
    },
  }
  searchRandomSpawnRectAround(
    x: number,
    y: number,
    options?: Partial<typeof Spawner.searchRandomSpawnRectAroundDefaultOptions>,
  ): Rectangle | null {
    R.setRandom(this.state.random)

    const {
      spawnSize = this.getSize(),
      radiusRatioRange,
      searchCount,
    } = { ...Spawner.searchRandomSpawnRectAroundDefaultOptions, ...options }

    const done = (rect: Rectangle | null): Rectangle | null => {
      this.searchRandomSpawnRectAroundStats.totalSearches++
      if (rect)
        this.searchRandomSpawnRectAroundStats.successfulSearches++

      const sizeStats = this.searchRandomSpawnRectAroundStats.bySize
      sizeStats.totalSearches.set(spawnSize, (sizeStats.totalSearches.get(spawnSize) ?? 0) + 1)
      if (rect)
        sizeStats.successfulSearches.set(spawnSize, (sizeStats.successfulSearches.get(spawnSize) ?? 0) + 1)

      return rect
    }

    const rect = this.searchRandomSpawnRectAt(x, y, spawnSize)
    if (rect)
      return done(rect)

    const angleOffset = R.f(0, 2 * Math.PI)
    for (const index of R.coprimePermutation(searchCount)) {
      const t1 = index / searchCount
      const angle = angleOffset + t1 * Math.PI * 2
      const t2 = (index + 1) / searchCount
      const radius = R.f(...radiusRatioRange) * t2
      const offsetX = Math.cos(angle) * radius
      const offsetY = Math.sin(angle) * radius
      const rect = this.searchRandomSpawnRectAt(x + offsetX, y + offsetY, spawnSize)
      if (rect)
        return done(rect)
    }

    return done(null)
  }
}
