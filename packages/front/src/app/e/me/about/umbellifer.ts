import { Color, Group, Vector2, Vector3 } from 'three'
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from 'three/examples/jsm/Addons.js'

import { TransformDeclaration } from 'some-utils-three/declaration'
import { fromVector3Declaration } from 'some-utils-three/declaration/vector'
import { createBendUniforms, glsl_bend } from 'some-utils-three/glsl/transform/bend'
import { slerpVectors } from 'some-utils-three/math/slerp-vectors'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { AngleDeclaration, fromAngleDeclaration, Vector3Declaration } from 'some-utils-ts/declaration'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

/**
 * A segment of an umbellifer structure.
 * 
 * Note:
 * - The segment subdivisions are not stored as child segments, but generated on the fly when needed.
 * - The subdivisions is slightly unoptimized, since it recalculates the subdivision count multiple times (involving distance calculations).
 */
class Segment {
  static #shared = { _v: new Vector3(), _c: new Color() }
  parent: Segment | null = null
  children: Segment[] = []

  startColor = new Color('white')
  endColor = new Color('white')

  get length() { return this.getLength() }
  set length(length: number) { this.setLength(length) }

  constructor(
    public start: Vector3,
    public end: Vector3,
    public normal: Vector3,
  ) { }

  getSubdivisionCount(): number {
    const length = this.start.distanceTo(this.end)
    if (length <= .05) return 2
    return Math.ceil(length / .08)
  }

  *positions() {
    yield* this.start
    const count = this.getSubdivisionCount()
    const { _v } = Segment.#shared
    for (let i = 1; i < count - 1; i++) {
      _v.lerpVectors(this.start, this.end, i / count)
      yield* _v
      yield* _v
    }
    yield* this.end
  }

  *colors() {
    yield* this.startColor
    const count = this.getSubdivisionCount()
    const { _c } = Segment.#shared
    for (let i = 1; i < count - 1; i++) {
      _c.lerpColors(this.startColor, this.endColor, i / count)
      yield* _c
      yield* _c
    }
    yield* this.endColor
  }

  getChild(...indices: number[]): Segment {
    let segment: Segment = this
    for (const index of indices) {
      segment = segment.children[index]
    }
    return segment
  }

  getLength(): number {
    return this.start.distanceTo(this.end)
  }

  setLength(length: number): this {
    const { _v } = Segment.#shared
    const direction = _v.subVectors(this.end, this.start).normalize()
    this.end.copy(this.start).addScaledVector(direction, length)
    return this
  }

  mulLength(factor: number): this {
    const { _v } = Segment.#shared
    _v.subVectors(this.end, this.start).multiplyScalar(factor)
    this.end.copy(this.start).add(_v)
    return this
  }

  isRoot(): boolean {
    return this.parent === null
  }

  isLeaf(): boolean {
    return this.children.length === 0
  }

  allDescendantsCount(): number {
    let count = 1
    for (const child of this.children) {
      count += child.allDescendantsCount()
    }
    return count
  }

  *allDescendantsColors(): Generator<number> {
    for (const segment of this.allDescendants({ includeSelf: true })) {
      yield* segment.colors()
    }
  }

  *allDescendantsPositions(): Generator<number> {
    for (const segment of this.allDescendants({ includeSelf: true })) {
      yield* segment.positions()
    }
  }

  *allDescendants({ includeSelf = false } = {}): Generator<Segment> {
    if (includeSelf)
      yield this

    for (const child of this.children)
      yield* child.allDescendants({ includeSelf: true })
  }

  *allAscendants({ includeSelf = false } = {}): Generator<Segment> {
    if (includeSelf)
      yield this

    let current: Segment | null = this.parent
    while (current) {
      yield current
      current = current.parent
    }
  }

  *allLeaves({ includeSelf = false } = {}): Generator<Segment> {
    for (const child of this.allDescendants({ includeSelf })) {
      if (child.isLeaf())
        yield child
    }
  }

  split(count: number, {
    angle = <AngleDeclaration>'45deg',
    length = 1,
    lengthVariationFactor = 1,
    altDir = <undefined | Vector3Declaration>undefined,
    altDirWeight = 0,
  } = {}): this {
    const direction = new Vector3().subVectors(this.end, this.start)
    const currentLength = direction.length()
    direction.divideScalar(currentLength)

    if (altDir) {
      const _altDir = fromVector3Declaration(altDir).normalize()
      slerpVectors(direction, _altDir, altDirWeight, direction)
    }

    const _angle = fromAngleDeclaration(angle)
    for (let i = 0; i < count; i++) {
      const childLength = length * Math.pow(lengthVariationFactor, R.number(-1, 1))
      const child = new Segment(
        this.end,
        new Vector3().addVectors(
          this.end,
          direction.clone()
            .applyAxisAngle(this.normal, _angle)
            .applyAxisAngle(direction, 2 * Math.PI * i / count)
            .multiplyScalar(childLength),
        ),
        this.normal,
      )
      child.parent = this
      this.children.push(child)
    }
    return this
  }
}

export class Umbellifer extends Group {
  material: LineMaterial

  uTime = { value: 0 }
  uNoiseAmplitude = { value: 1 }
  bendAmplitude = 1

  get noiseAmplitude() { return this.uNoiseAmplitude.value }
  set noiseAmplitude(value: number) { this.uNoiseAmplitude.value = value }

  constructor(seed = 256789, {
    splitIndices = <number[][]>[
      [2],
    ]
  } = {}) {
    super()

    const s0 = new Segment(
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(1, 0, 0),
    )

    R.setRandom('parkmiller', seed)

    s0.split(3, { angle: '15deg', lengthVariationFactor: 1.8 })

    for (const indices of splitIndices)
      s0.getChild(...indices).mulLength(1.2).split(3, { angle: '20deg', lengthVariationFactor: 1.4 })

    for (const leaf of [...s0.allLeaves()]) {
      leaf.split(6, { angle: '70deg', length: .28, altDir: [0, 1, 1], altDirWeight: .5 })
      leaf.split(1, { angle: '0deg', length: .17, altDir: [0, 1, 1], altDirWeight: .5 })
    }

    for (const leaf of [...s0.allLeaves()])
      leaf.split(11, { angle: '70deg', length: .12, altDir: [0, 1, 0], altDirWeight: .5, lengthVariationFactor: 1.1 })

    for (const leaf of [...s0.allLeaves()])
      leaf.split(13, { angle: '70deg', length: .04, altDir: [0, 1, 0], altDirWeight: .75, lengthVariationFactor: 1.1 })

    console.log(s0.allDescendants().reduce((acc, cur) => acc + cur.getSubdivisionCount(), 0) / s0.allDescendantsCount())

    {
      // Set colors from leaves to root:
      const color0 = makeColor('#ecde0d').clone()
      const color1 = makeColor('#bbfffeff').clone()
      const stepMax = 3
      let stepCount = 0
      let set0 = new Set<Segment>(s0.allLeaves())
      let set1 = new Set<Segment>()
      const swap = () => { [set0, set1] = [set1, set0] }
      const clampAlpha = (a: number) => Math.min(1, Math.max(0, a))
      while (set0.size > 0) {
        for (const segment of set0) {
          // segment.startColor.set(color0)
          // segment.endColor.set(color1)
          segment.endColor.lerpColors(color0, color1, clampAlpha(stepCount / stepMax))
          segment.startColor.lerpColors(color0, color1, clampAlpha((stepCount + 1) / stepMax))
          if (segment.parent)
            set1.add(segment.parent)
        }
        set0.clear()
        swap()
        stepCount++
      }
    }

    const geometry = new LineSegmentsGeometry()
    geometry.setPositions([...s0.allDescendantsPositions()])
    geometry.setColors([...s0.allDescendantsColors()])

    const material = new LineMaterial({
      color: 'white',
      worldUnits: true,
      linewidth: .0015,
      vertexColors: true,
    })

    setup(new LineSegments2(geometry, material), this)

    this.scale.setScalar(0.25)

    this.material = material
  }

  positionOnScene?: (sceneSize: Vector2) => void
  setPositionOnScene(fn: (sceneSize: Vector2) => void): this {
    this.positionOnScene = fn
    return this
  }

  bendUniforms: null | ReturnType<typeof createBendUniforms> = null
  bendTransform: null | TransformDeclaration = null
  enableBend(): this {
    const glslPatterns = [
      'vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );',
      'vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );',
    ]
    const bendTransform: TransformDeclaration = {
      rotationZ: '90deg',
      rotationY: '20deg',
    }
    const bendUniforms = createBendUniforms(makeMatrix4(bendTransform))
    this.material.onBeforeCompile = shader => {
      ShaderForge.with(shader)
        .uniforms({
          ...bendUniforms,
          uTime: this.uTime,
          uNoiseAmplitude: this.uNoiseAmplitude,
        })
        .vertex.top(
          glsl_bend,
          glsl_utils,
          glsl_stegu_snoise,
        )
        .vertex.mainAfterAll(/* glsl */ `
          // Debug: instance ID to color (displaying the segment)
          // vColor = hash3(float(gl_InstanceID));
        `)

      const v = shader.vertexShader
      const index0 = shader.vertexShader.indexOf(glslPatterns[0])
      const index1 = shader.vertexShader.indexOf(glslPatterns[1])
      shader.vertexShader =
        v.substring(0, index0)
        + /* glsl */`
          vec4 start = vec4( instanceStart, 1.0 );
          vec4 end = vec4( instanceEnd, 1.0 );

          start = modelMatrix * start;
          end = modelMatrix * end;

          start = applyBend(start, uBendFactor, uBendMatrix, uBendMatrixInverse);
          end = applyBend(end, uBendFactor, uBendMatrix, uBendMatrixInverse);

          float time = uTime * 0.15;
          float noiseScale = 0.825;
          float startNoise = snoise(vec4(start.xyz * noiseScale, time)) * instanceStart.y;
          float endNoise = snoise(vec4(end.xyz * noiseScale, time)) * instanceEnd.y;

          start.xz += vec2(1.0, -1.0) * startNoise * uNoiseAmplitude * 0.01;
          end.xz += vec2(1.0, -1.0) * endNoise * uNoiseAmplitude * 0.01;

          start = viewMatrix * start;
          end = viewMatrix * end;
        `
        + v.substring(index1 + glslPatterns[1].length)
    }
    this.bendUniforms = bendUniforms
    this.bendTransform = bendTransform
    return this
  }

  updateBendTransform(transform: TransformDeclaration): this {
    if (this.bendUniforms) {
      makeMatrix4(transform, this.bendUniforms.uBendMatrix.value)
      this.bendUniforms.uBendMatrixInverse.value.copy(this.bendUniforms.uBendMatrix.value).invert()
    }
    return this
  }

  update(deltaTime: number): this {
    this.uTime.value += deltaTime
    if (this.bendUniforms) {
      const time = this.uTime.value
      this.bendUniforms.uBendFactor.value = this.bendAmplitude * 0.33 * (
        Math.sin(time * 1.5) * .1
        + Math.sin(time * 3.34) * .03
        + Math.sin(time * 4.732) * .01
      )
    }
    return this
  }
}