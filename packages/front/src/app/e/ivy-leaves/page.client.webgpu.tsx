'use client'

import { EnvRoom } from '@/misc/env-room'
import { ThreeProvider, useGroup, useThreeWebGPU } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { DynamicInstancedMesh } from 'some-utils-three/objects/DynamicInstancedMesh'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'
import { BufferAttribute, BufferGeometry, CubicBezierCurve, Curve, Group, IcosahedronGeometry, Mesh, MeshPhysicalMaterialParameters, Shape, Vector2, Vector2Like } from 'three'
import { mix } from 'three/src/nodes/TSL.js'
import { color, float, mx_noise_float, uv } from 'three/tsl'
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
import { LeafGeometry } from './LeafGeometry'

class ShapeEditor extends Group {
  helper = setup(new DebugHelper(), this)

  shape: Shape

  #state = {
    selectedPoint: null as Vector2 | null,
  }

  constructor(shape: Shape) {
    super()
    this.shape = shape
    this.draw()
  }

  *#curvePoint() {
    const it = {
      curveIndex: -1,
      curve: null! as Curve<Vector2>,
      point: null! as Vector2,
    }
    for (const curve of this.shape.curves) {
      if (curve instanceof CubicBezierCurve) {
        it.curveIndex++
        it.curve = curve
        it.point = curve.v1
        yield it
        it.point = curve.v2
        yield it
        it.point = curve.v3
        yield it
      }
    }
  }

  #nearestPoint(p: Vector2Like) {
    let nearestPoint: Vector2 | null = null
    let nearestDistance = Infinity
    for (const { point } of this.#curvePoint()) {
      const distance = point.distanceTo(p)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestPoint = point
      }
    }
    return nearestPoint
  }

  draw() {
    const { helper, shape } = this
    const color = '#ff0000'
    helper.clear()
    for (const { point } of this.#curvePoint()) {
      const size = point === this.#state.selectedPoint ? 0.2 : 0.1
      helper.point(point, { color, shape: 'circle', size })
    }
    helper.polyline(shape.getPoints(50), { color })
  }

  onTick(tick: Tick, three: ThreeBaseContext) {
    const { point } = three.pointer.intersectPlane('xy')
    const nearestPoint = this.#nearestPoint(point)
    if (nearestPoint && nearestPoint.distanceTo(point) < 0.2) {
      this.#state.selectedPoint = nearestPoint
    } else {
      this.#state.selectedPoint = null
    }
    this.draw()
  }
}

function computeUvForFlatGeometry(geometry: BufferGeometry, uvAttributeName = 'uv') {
  const positionAttribute = geometry.getAttribute('position')
  const uvArray = new Float32Array(positionAttribute.count * 2)
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i)
    const y = positionAttribute.getY(i)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const width = maxX - minX
  const height = maxY - minY
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i)
    const y = positionAttribute.getY(i)
    uvArray[i * 2 + 0] = (x - minX) / width
    uvArray[i * 2 + 1] = (y - minY) / height
  }
  geometry.setAttribute(uvAttributeName, new BufferAttribute(uvArray, 2))
}

class IvyMaterial extends MeshPhysicalNodeMaterial {
  static defaultParameters = {
    color1: '#048132',
    color2: '#e1e167',
  }
  constructor(parameters?: Partial<typeof IvyMaterial.defaultParameters> & MeshPhysicalMaterialParameters) {
    const {
      color1,
      color2,
      ...baseParameters
    } = { ...IvyMaterial.defaultParameters, ...parameters }
    super({
      // wireframe: true,
      side: 2,
      ...baseParameters,
    })
    const alpha = uv(2).y
      .add(mx_noise_float(uv().mul(3)).mul(.1).mul(uv(2).y.oneMinus().pow(1 / 4)))
      .mul(3).fract().pow(2)
    this.colorNode = mix(color(color1), color(color2), alpha)
  }
}

class Shape1 extends Shape {
  constructor() {
    super()
    this.moveTo(0, 0)
    this.bezierCurveTo(1, -0.6, 2, -0.2, 2, 0.5)
    this.bezierCurveTo(2, 2, 1, 2, 0, 3)
  }
}

export function MyScene() {
  const three = useThreeWebGPU()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    const env = new EnvRoom()
      .addLights()
      .addTorusKnots()
    env.applyToScene(three.scene, three.renderer)
    // setup(env, group)

    {
      const shape = new Shape1()
      const geometry = new LeafGeometry(out => {
        const { x, y } = out
        const p = shape.getPointAt(x)
        out.copy(p).multiplyScalar(y)
      }, {
        vSubdivisions: 12,
        flipTriangles: true,
      })
      const mesh = setup(new Mesh(geometry, new IvyMaterial({ color1: '#005651', color2: '#e1e167' })), {
        parent: group,
        position: [0, 0, 0],
      })

      const m2 = new IvyMaterial({ color1: '#004cb6', color2: '#00e5ff' })
      setup(new Mesh(geometry, m2), {
        parent: group,
        rotation: '0, 0, 23deg',
        position: [-1, 1, -1],
      })

      const m3 = new MeshPhysicalNodeMaterial({
        transmission: 1,
        roughness: .6,
        color: 'rgb(0, 234, 255)',
      })
      m3.transmissionNode = float(1)
      m3.roughnessNode = uv(2).y.mul(3).fract().pow(1 / 4).mix(.2, .6)
      setup(new Mesh(geometry, m3), {
        parent: group,
        rotation: '0, 0, -17deg',
        position: [1, 1, 1],
      })

      const m4 = new MeshPhysicalNodeMaterial({
        transmission: 1,
        roughness: .6,
        color: 'rgb(191, 255, 0)',
      })
      m4.roughnessNode = uv(2).y.mul(3).fract().pow(1 / 4).mix(.2, .6)
      setup(new Mesh(geometry, m4), {
        parent: group,
        rotation: '0, 0, -4deg',
        position: [0, 1.5, .5],
      })

      const m5 = new MeshPhysicalNodeMaterial({
        metalness: .8,
        roughness: .1,
        color: 'rgb(0, 255, 200)',
      })
      m5.roughnessNode = uv(2).y.mul(3).fract().pow(1 / 4).mix(0, .6)
      setup(new Mesh(geometry, m5), {
        parent: group,
        rotation: '0, 0, 4deg',
        position: [0, 3, .25],
      })
    }

    {
      const geometry = new IcosahedronGeometry(.5, 8)
      const material = new MeshPhysicalNodeMaterial({ emissive: '#00ffff', emissiveIntensity: 2 })
      const mesh = setup(new DynamicInstancedMesh(geometry, material), group)
      mesh.addInstance({
        position: [3, 3, 0],
      })
    }

  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      webgpu
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}