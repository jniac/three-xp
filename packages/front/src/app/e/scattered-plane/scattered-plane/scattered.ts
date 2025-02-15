import { DirectionalLight, DoubleSide, HemisphereLight, InstancedBufferAttribute, InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, RepeatWrapping, Vector2, Vector3, Vector4 } from 'three'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { LineHelper } from 'some-utils-three/helpers/line'
import { UnifiedLoader } from 'some-utils-three/loaders/unified-loader'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { addTo } from 'some-utils-three/utils/tree'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { glsl_uv_size } from 'some-utils-ts/glsl/uv-size'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { easeInOut2, easeInOut4 } from 'some-utils-ts/math/easing'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { PRNG } from 'some-utils-ts/random/prng'
import { Tick } from 'some-utils-ts/ticker'
import { Vector2Like } from 'some-utils-ts/types'

import { Distribution, DistributionProps } from './distribution'

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

function addProperties(target: object, properties: [name: string, scope: any, key: string, meta: string][]) {
  for (const [name, scope, key, meta] of properties) {
    Object.defineProperty(target, `${name}_meta`, {
      enumerable: true,
      value: meta,
    })
    Object.defineProperty(target, name, {
      enumerable: true,
      get() { return scope[key] },
      set(value) {
        scope[key] = value
      },
    })
  }
  return target
}

class ScatteredBasicMaterial extends MeshBasicMaterial {
  uniforms = {
    uDispersionTime: { value: 0 },
    uLowDispersionTime: { value: 0 },
    /**
     * - `x`: [0: no dispersion, 1: full dispersion]
     * - `y`: "Out" position [-1: double its position, 1: collapse to center]
     * - `z`: "In" position [-1: double its position, 1: collapse to center]
     * - `w`: "Cycle Count" [1: (1:1) always visible, n: (1:n) visible 1 time in n]
     */
    uDispersion: { value: new Vector4(1, -.6, .4, 2) },
    /**
     * - `x`: [0: no dispersion, 1: full dispersion]
     */
    uLowDispersion: { value: new Vector4(0, -.6, .4, 0) },
    /**
     * - `x`: chunk scale
     * - `y`: image visibility
     */
    uMainParams: { value: new Vector4(1, 0) },
    uCenter: { value: new Vector3() },
    /**
     * - `x`: aspect
     * - `y`: sizeMode
     * - `z`: align-x
     * - `w`: align-y
     */
    uMapInfo: { value: new Vector4(1, 1, .5, .5) },
    /**
     * - `x`: width
     * - `y`: height
     * - `z`: -
     * - `w`: -
     */
    uScatteredInfo: { value: new Vector4(1, 1, 0, 0) },
    uNormalMap: {
      value: UnifiedLoader
        .get('three')
        .loadTexture('textures/rough_concrete_nor_gl_1k.jpg', texture => {
          texture.wrapS = texture.wrapT = RepeatWrapping
        }),
    },
  }

  userData = addProperties({}, [
    [
      'chunkScale', this.uniforms.uMainParams.value, 'x', `
        Name(chunk.scale)
        Slider(0, 1, step: any)
      `
    ],
    [
      'imageVisibility', this.uniforms.uMainParams.value, 'y', `
        Name(image.visibility)
        Slider(0, 1, step: any)
      `
    ],
    [
      'dispX', this.uniforms.uDispersion.value, 'x', `
        Name(disp.x)
        Slider(0, 1, step: any)
      `
    ],
    [
      'dispY', this.uniforms.uDispersion.value, 'y', `
        Name(disp.y)
        Slider(-1, 1, step: any)
      `
    ],
    [
      'dispZ', this.uniforms.uDispersion.value, 'z', `
        Name(disp.z)
        Slider(-1, 1, step: any)
      `
    ],
    [
      'dispW', this.uniforms.uDispersion.value, 'w', `
        Name(disp.cycle)
        Slider(1, 20, step: 1)
      `
    ],
    [
      'lowDispX', this.uniforms.uLowDispersion.value, 'x', `
        Name(lowDisp.x)
        Slider(0, 1, step: any)
      `
    ],
  ])

  get mapAspect() { return this.uniforms.uMapInfo.value.x }
  set mapAspect(value) { this.uniforms.uMapInfo.value.x = value }

  getScatteredSize(out: Vector2Like = new Vector2()) {
    out.x = this.uniforms.uScatteredInfo.value.x
    out.y = this.uniforms.uScatteredInfo.value.y
    return out
  }
  setScatteredSize(value: Vector2Like) {
    this.uniforms.uScatteredInfo.value.x = value.x
    this.uniforms.uScatteredInfo.value.y = value.y
  }
  get scatteredSize() { return this.getScatteredSize() }
  set scatteredSize(value) { this.setScatteredSize(value) }

  constructor() {
    super({
      side: DoubleSide,
    })

    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({
        USE_UV: '',
      })
      .uniforms(this.uniforms)
      .varying({
        vRand: 'vec4',
      })
      .vertex.top(
        glsl_utils,
        glsl_easings,
        glsl_uv_size)
      .vertex.top(/* glsl */`
        attribute vec4 aRectUv;
        attribute vec4 aRand;
      `)
      .vertex.top(/* glsl */`
        vec2 delta;
        float scatterRatio;

        vec4 computeDispersion() {
          if (uDispersion.x == 0.0) {
            return vec4(0.0, 0.0, 0.0, 1.0);
          }

          float duration = lerp(8.0, 1.0, aRand.x * aRand.y * aRand.z);
          float cycleCount = max(floor(uDispersion.w), 1.0);
          float time = mod(uDispersionTime + duration * cycleCount * aRand.x, duration * cycleCount) / duration;
          float cycleVisibility = time <= 1.0 ? 1.0 : easeInOut3(1.0 - inverseLerp(.8 * aRand.w + .1, .8 * aRand.w + .2, uDispersion.x));
          time = mod(time, 1.0);
          float size = easeInThenOut(time, 8.0) * lerp(2.0, 1.0, time * time) * cycleVisibility;
          size = mix(1.0, size, pow(uDispersion.x, 1.0 / 2.0));

          // Apply scale before instanceMatrix (shrinking).
          vec3 dispersed;
          dispersed.xy = -delta * lerp(uDispersion.y, uDispersion.z, time);
          dispersed.z = lerp(1.0, 0.0, time);
          dispersed *= uDispersion.x;

          return vec4(dispersed, size);
        }

        float getStartEffect(float time, float duration) {
          return min(1.0, time / duration);
        }

        float getEndEffect(float time, float timeMax, float duration) {
          return max(0.0, time - (timeMax - duration)) / duration;
        }

        vec4 computeLowDispersion() {
          if (uLowDispersion.x == 0.0) {
            return vec4(0.0, 0.0, 0.0, 1.0);
          }

          float periodScalarT = inverseLerp(0.1, 0.9, scatterRatio);
          float period = lerp(2.0, 8.0, aRand.x) * lerp(60.0, 1.0, periodScalarT);
          float time = mod(uLowDispersionTime + period * aRand.z, period);

          float duration = 1.0;
          float effectStart = min(1.0, time);
          float effectEnd = getEndEffect(time, period, duration);

          float size = getStartEffect(time, 0.3) * (1.0 - getEndEffect(time, period, 0.3));
          size = pow(size, 1.0 / 4.0);
          size = mix(1.0, size, pow(uLowDispersion.x, 1.0 / 4.0));

          vec3 dispersed;

          dispersed.xy = delta * 0.1;
          dispersed.z = 0.2;
          dispersed.xyz *= getEndEffect(time, period, 1.0);
          dispersed *= uLowDispersion.x;

          return vec4(dispersed, size);
        }
      `)
      .vertex.replace('project_vertex', /* glsl */`
        vec4 mvPosition = vec4(position, 1.0);
        delta = instanceMatrix[3].xy - uCenter.xy;
        scatterRatio = clamp(1.1 * length(delta) / (length(uScatteredInfo.xy) / 2.0), 0.0, 1.0);

        vec4 dispersion = computeDispersion();
        vec4 lowDispersion = computeLowDispersion();

        float scale = clamp01(uMainParams.x * 3.0 - 2.0 * aRand.w);
        mvPosition.xyz *= dispersion.w * lowDispersion.w * easeInOut3(scale);

        mvPosition = instanceMatrix * mvPosition;
        mvPosition.xyz += dispersion.xyz + lowDispersion.xyz;

        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;      
      `)

      .vertex.replace('uv_vertex', /* glsl */`
        #if defined( USE_UV ) || defined( USE_ANISOTROPY )
          vUv = vec3( uv, 1 ).xy;
          vUv = aRectUv.xy + aRectUv.zw * vUv;
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

      .vertex.mainAfterAll(/* glsl */`
        vRand = aRand;
      `)

      .fragment.top(
        glsl_utils,
        glsl_easings)
      .fragment.replace('color_fragment', /* glsl */`
        vec3 normal = texture2D(uNormalMap, vUv * 4.0).rgb;
        vec3 light = normalize(vec3(0.5, 2.5, 1.0));
        float colorAlteration = mix(0.333, 1.0, dot(normal, light));
        float transition = inverseLerp(0.0, 0.2, uMainParams.y - 0.8 * vRand.w);
        diffuseColor.rgb = mix(vColor * colorAlteration, diffuseColor.rgb, transition);
      `)
  }

  update(deltaTime: number) {
    deltaTime *= 0.33

    this.uniforms.uDispersionTime.value +=
      deltaTime * this.uniforms.uDispersion.value.x

    this.uniforms.uLowDispersionTime.value +=
      deltaTime * this.uniforms.uLowDispersion.value.x
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

    const aRand = new InstancedBufferAttribute(new Float32Array(count * 4), 4)
    geometry.setAttribute('aRand', aRand)

    for (let i = 0; i < count; i++) {
      aRand.setXYZW(i, PRNG.random(), PRNG.random(), PRNG.random(), PRNG.random())
    }

    const material = new ScatteredBasicMaterial()
    const mesh = new InstancedMesh(geometry, material, count)
    mesh.name = 'plane'

    return mesh
  }

  readonly props: Readonly<ScatteredPlaneProps>

  internal: {
    count: number
    plane: InstancedMesh<PlaneGeometry, ScatteredBasicMaterial>
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

    const lineHelper = new LineHelper()
    addTo(lineHelper, this)

    const lightSetup = new LightSetup()
    addTo(lightSetup, this)

    this.internal = { count, plane, lineHelper, lightSetup }
    this.props = props

    this.distribute(this.getDistribution())
  }

  onTick(tick: Tick) {
    this.internal.plane.material.update(tick.deltaTime)
  }

  getDistribution(props: Partial<DistributionProps> = {}) {
    return new Distribution(this, props)
  }

  drawDistribution(distribution: Distribution) {
    const { position, size, scatterPadding } = distribution.props
    const { x: px, y: py } = fromVector2Declaration(position)
    const { x: sx, y: sy } = fromVector2Declaration(size)
    this.internal.lineHelper
      .rectangle([px, py, sx, sy])
      .rectangle([px, py, sx + scatterPadding * 2, sy + scatterPadding * 2])
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

    const rootRect = distribution.root.rect
    plane.material.setScatteredSize(rootRect.getSize())
    plane.material.uniforms.uCenter.value.copy(rootRect.getCenter())
  }

  lerpDistribute(distribution0: Distribution, distribution1: Distribution, t: number) {
    const { count, plane } = this.internal
    const { aRectUv } = plane.geometry.attributes

    const rect = new Rectangle()
    const uvRect = new Rectangle()
    const rootRect = new Rectangle()

    const v0 = new Vector3()
    const v1 = new Vector3()

    const maxOffsetT = .3
    for (let i = 0; i < count; i++) {
      const node0 = distribution0.nodes[i]
      const node1 = distribution1.nodes[i]

      const startT = maxOffsetT * (1 - node0.r0 * (node0.scatterCoeff + node1.r0 * .2))
      const instanceFlatT = inverseLerp(startT, 1 - maxOffsetT + startT, t)
      const instanceEaseT = easeInOut4(instanceFlatT)

      rect.lerpRectangles(node0.rect, node1.rect, instanceEaseT)
      uvRect.lerpRectangles(node0.uvRect, node1.uvRect, instanceEaseT)
      plane.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(v0),
        scale: rect.getSize(v1),
        // rotationY: .3 * Math.sin(instanceFlatT * Math.PI) * (-1 + 2 * node0.r1),
        rotationY: (node1.r0 < .5 ? 0 : 1) * instanceEaseT * Math.PI * 2,
        rotationZ: .3 * Math.sin(instanceFlatT * Math.PI) * (-1 + 2 * node0.r0),
      }))
      aRectUv.setXYZW(i, uvRect.x, uvRect.y, uvRect.width, uvRect.height)
    }

    const rootT = easeInOut2(inverseLerp(maxOffsetT, 1 - maxOffsetT, t))
    rootRect.lerpRectangles(distribution0.root.rect, distribution1.root.rect, rootT)
    plane.material.setScatteredSize(rootRect.getSize())
    plane.material.uniforms.uCenter.value.copy(rootRect.getCenter())

    plane.instanceMatrix.needsUpdate = true
    aRectUv.needsUpdate = true
  }
}
