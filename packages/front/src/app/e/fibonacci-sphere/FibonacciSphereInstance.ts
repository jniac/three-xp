import { Group, IcosahedronGeometry, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Quaternion, TorusGeometry, Vector3 } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { getFibonacciSphereSamplesArray } from 'some-utils-three/misc/fibonacci-sphere-samples'
import { DynamicInstancedMesh } from 'some-utils-three/objects/DynamicInstancedMesh'
import { makeColor } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { exponentialLerp, lerp } from 'some-utils-ts/math/basic'
import { easeInOut } from 'some-utils-ts/math/easing'
import { Tick } from 'some-utils-ts/ticker'

import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { geometries } from './FibonacciSphereInstance.geometries'

function sphereArea(radius: number) {
  return 4 * Math.PI * radius ** 2
}

export class FibonacciSphereInstance extends Group {
  static defaultProps = {
    count: 1000,
    colors: [
      '#fff',
      '#fff',
      '#ff0',
      '#ff0',
      '#fff',
      '#fff',
      '#3df49c',
      'rgb(88, 0, 160)',
      '#fff',
    ].map(c => makeColor(c).clone()),
  }
  static #private = {
    m: new Matrix4(),
    q: new Quaternion(),
    v0: new Vector3(),
    v1: new Vector3(),
    forward: new Vector3(0, 0, 1),
  }

  parts = (() => {
    const roundedDisc = geometries.createRoundedDisc()
    const squashedSphere = geometries.createSquashedSphere()
    const funnyShape = geometries.createFunnyShape()

    const meshes = [
      // Plain 01
      setup(new DynamicInstancedMesh(
        squashedSphere,
        new AutoLitMaterial({}),
        { initialCapacity: 1000, enableColors: true },
      ), this),

      // Plain 02
      setup(new DynamicInstancedMesh(
        funnyShape,
        new AutoLitMaterial({}),
        { initialCapacity: 1000, enableColors: true },
      ), this),

      // Glass 01
      setup(new DynamicInstancedMesh(
        roundedDisc,
        new MeshPhysicalMaterial({
          transmission: 1,
          roughness: .2,
          thickness: .2,
          ior: 1.5,
          dispersion: 10,
        }),
        { initialCapacity: 1000, enableColors: true },
      ), this),

      // Glass 02
      setup(new DynamicInstancedMesh(
        funnyShape,
        new MeshPhysicalMaterial({
          transmission: 1,
          roughness: .2,
          thickness: .2,
          ior: 1.5,
          dispersion: 10,
        }),
        { initialCapacity: 1000, enableColors: true },
      ), this),

      // Metal
      setup(new DynamicInstancedMesh(
        funnyShape,
        new MeshPhysicalMaterial({
          metalness: 1,
          roughness: .2,
          clearcoat: 1,
          clearcoatRoughness: 0,
          iridescence: .5,
          iridescenceIOR: 1.3,
        }),
        { initialCapacity: 1000, enableColors: true },
      ), this),

    ]

    const ring = setup(new Mesh(
      new TorusGeometry(1.05, .0025, 16, 100),
      new MeshBasicMaterial(),
    ), {
      parent: this,
      rotation: '0deg, 90deg, 0deg',
    })

    const bottomSphere = setup(new Mesh(
      new IcosahedronGeometry(.5, 10),
      new AutoLitMaterial({}),
    ), {
      parent: this,
      visible: false, // nah
      z: -1,
    })

    RandomUtils.setRandom('parkmiller', 5678)
    RandomUtils.shuffleArray(meshes, { inPlace: true })

    return {
      meshes,
      ring,
      bottomSphere,
    }
  })()

  props: typeof FibonacciSphereInstance.defaultProps
  array: Float32Array

  time = 0
  timeOld = -1
  paused = false
  timeScaleOptions = [0, .01, .1, 1]
  timeScale = 1


  constructor(props?: Partial<typeof FibonacciSphereInstance.defaultProps>) {
    super()
    this.props = { ...FibonacciSphereInstance.defaultProps, ...props }

    const array = getFibonacciSphereSamplesArray(this.props.count)
    this.array = array

    const { m, q, v0, v1, forward } = FibonacciSphereInstance.#private
    const { meshes } = this.parts
    const { colors } = this.props
    v1.setScalar(.09)
    for (let i = 0; i < this.props.count; i++) {
      v0.fromArray(array, i * 3)
      q.setFromUnitVectors(forward, v0)
      m.compose(v0, q, v1)
      meshes[i % meshes.length].addInstance(m, colors[i % colors.length])
    }
  }

  update(t = 1) {
    t = easeInOut(t, 1.2)

    const { meshes, bottomSphere } = this.parts
    const { count, colors } = this.props
    const { array } = this

    const currentCount = exponentialLerp(1, count, t)
    for (const mesh of meshes) {
      mesh.clear()
    }

    getFibonacciSphereSamplesArray(currentCount, { out: array })

    const size = lerp(1, 3, t ** 2) * (1 / currentCount) ** .5

    const { m, q, v0, v1, forward } = FibonacciSphereInstance.#private
    v1.setScalar(size)

    bottomSphere.scale.setScalar(size)

    const max = Math.floor(currentCount)
    for (let i = 0; i < max; i++) {
      v0.fromArray(array, i * 3)
      q.setFromUnitVectors(forward, v0)
      m.compose(v0, q, v1)
      meshes[i % meshes.length].addInstance(m, colors[i % colors.length])
    }
  }

  toggleTimeScale() {
    const currentIndex = this.timeScaleOptions.indexOf(this.timeScale)
    const nextIndex = (currentIndex + 1) % this.timeScaleOptions.length
    this.timeScale = this.timeScaleOptions[nextIndex]
  }

  step(direction = 1) {
    console.log('stepping')
    this.timeScale = 0
    this.time += 0.01 * direction
  }

  onTick(tick: Tick) {
    if (this.paused)
      return

    this.time += tick.deltaTime * this.timeScale
    if (this.time === this.timeOld)
      return

    this.timeOld = this.time

    const t = Math.cos(this.time * .8) * .5 + .5
    this.update(t)
  }
}