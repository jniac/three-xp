'use client'

import { BoxGeometry, BufferGeometry, Vector3 } from 'three'

import { useGroup } from 'some-utils-misc/three-provider'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { AutoLitWireframeMesh } from '../AutoLitWireframeMesh'
import { SurfaceWalker } from '../surface-walker'

class Triangle {
  geometry: BufferGeometry

  constructor(geometry: BufferGeometry) {
    this.geometry = geometry
  }

  getPoint(
    triangleIndex: number,
    barycentric: Iterable<number>,
    out = new Vector3()
  ) {
    const position = this.geometry.attributes.position
    let i0: number, i1: number, i2: number

    if (this.geometry.index) {
      i0 = this.geometry.index.getX(triangleIndex * 3 + 0)
      i1 = this.geometry.index.getX(triangleIndex * 3 + 1)
      i2 = this.geometry.index.getX(triangleIndex * 3 + 2)
    } else {
      i0 = triangleIndex * 3 + 0
      i1 = triangleIndex * 3 + 1
      i2 = triangleIndex * 3 + 2
    }

    const ax = position.getX(i0)
    const ay = position.getY(i0)
    const az = position.getZ(i0)

    const bx = position.getX(i1)
    const by = position.getY(i1)
    const bz = position.getZ(i1)

    const cx = position.getX(i2)
    const cy = position.getY(i2)
    const cz = position.getZ(i2)

    const [u, v] = barycentric
    const w = 1 - u - v

    out.set(
      ax * w + bx * u + cx * v,
      ay * w + by * u + cy * v,
      az * w + bz * u + cz * v,
    )
    return out
  }
}

export function CubeWalkDemo(props: TransformDeclaration) {
  useGroup('CubeWalkDemo', props, function* (group) {
    const s = 2, d = 4
    const cube = setup(new AutoLitWireframeMesh(new BoxGeometry(s, s, s, d, d, d)), group)

    const walker = new SurfaceWalker()
    walker.fromGeometry(cube.geometry)

    setup(new DebugHelper(), group)
      .zOffset(.01)
      .debugGeometry(cube.geometry)

    const helper = setup(new DebugHelper(), group).onTop()

    const triangleIndex = 138
    const barycentric = [0.5, 0.5]
    const radius = 1.5

    const result = walker.walk(triangleIndex, barycentric, [2.1, 1.1], radius)

    helper.clear()
    helper.circle({
      center: new Triangle(cube.geometry).getPoint(triangleIndex, barycentric),
      radius,
      quality: 'ultra'
    }, { color: '#f00' })
    helper.polyline([
      result.path[0].getPosition0(),
      ...result.path.map(segment => segment.getPosition1()),
    ], { color: '#f00', points: { shape: 'circle', size: .025 } })
  }, [])
  return null
}
