'use client'

import { BoxGeometry, BufferGeometry, Group, Vector3 } from 'three'

import { useGroup } from 'some-utils-misc/three-provider'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { TriangleHandler } from 'some-utils-three/math/TriangleHandler'
import { SurfaceWalker } from 'some-utils-three/mesh-surface/surface-walker'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'

import { AutoLitWireframeMesh } from '../utils/AutoLitWireframeMesh'

class HomogeneousTriangleRays extends Group {
  constructor(geometry: BufferGeometry) {
    super()

    const color = '#0fc'
    // const triangleIndex = 93
    const triangleIndex = 85
    const bOrigin = new Vector3(1 / 3, 1 / 3, 0)
    const radius = .75
    const helper = setup(new DebugHelper(), this).zOffset(.01)

    const triangleHandler = new TriangleHandler()
      .fromGeometry(geometry, triangleIndex)

    const walker = new SurfaceWalker()
    walker.fromGeometry(geometry)

    helper.circle({
      center: triangleHandler.pointToWorld(bOrigin),
      radius,
      axis: triangleHandler.normal(),
      quality: 'ultra'
    }, { color })

    const directionConverter = triangleHandler.createAngleToRectifiedBarycentricDirectionConverter()
    for (const it of loop(32)) {
      const angle = it.t * Math.PI * 2
      // const bDirection = new Vector3(Math.cos(angle), Math.sin(angle), 0)
      const result = walker.walk(triangleIndex, bOrigin, directionConverter(angle), { maxDistance: radius })
      if (result.path.length > 0) {
        helper.polyline([
          result.path[0].getPosition0(),
          ...result.path.map(segment => segment.getPosition1()),
        ], { color, points: { shape: 'circle', size: .025 } })
      }
    }
  }
}

export function CubeWalkDemo(props: TransformDeclaration) {
  useGroup('CubeWalkDemo', props, function* (group, three) {
    const s = 2, d = 4
    const cubeGeometry = new BoxGeometry(s, s, s, d, d, d)
      .rotateX(.2)
      .rotateY(.3)
    const cube = setup(new AutoLitWireframeMesh(
      cubeGeometry,
      { baseColor: 'hsl(240, 50%, 33%)', wireframeColor: 'hsl(240, 50%, 50%)' },
    ), group)

    const walker = new SurfaceWalker()
    walker.fromGeometry(cube.geometry)

    setup(new HomogeneousTriangleRays(cube.geometry), group)

    setup(new DebugHelper(), group)
      .zOffset(.01)
      .debugGeometry(cube.geometry)

    const helper = setup(new DebugHelper(), group).zOffset(.01)
    const draw = (
      triangleHandler: TriangleHandler,
      barycentricOrigin: Vector3,
      radius: number,
      result: ReturnType<SurfaceWalker['walk']>,
      color = '#f00'
    ) => {
      helper.circle({
        center: triangleHandler.pointToWorld(barycentricOrigin),
        radius,
        axis: triangleHandler.normal(),
        quality: 'ultra'
      }, { color })

      if (result.path.length > 0) {
        helper.polyline([
          result.path[0].getPosition0(),
          ...result.path.map(segment => segment.getPosition1()),
        ], { color: color, points: { shape: 'circle', size: .025 } })
      }
    }

    let triangleIndex1 = 138
    const bOrigin1 = new Vector3(1 / 3, 1 / 3, 0)
    const bDirection1 = new Vector3(15, 10, 0)
    const radius1 = 1.25

    const color1 = '#f00'
    const triangleHandler1 = new TriangleHandler().fromGeometry(cube.geometry, triangleIndex1)

    yield three.onTick(() => {
      const [I] = three.pointer.raycast(cube)
      if (I) {
        const localPoint = I.point.clone().sub(group.position)
        if (three.pointer.isButtonDownEnter()) {
          triangleIndex1 = I.faceIndex!
          triangleHandler1.fromGeometry(cube.geometry, triangleIndex1)
          triangleHandler1.pointToLocal(localPoint, bOrigin1)
        } else {
          const worldPoint = triangleHandler1.pointToWorld(bOrigin1)
          const worldDir = worldPoint.negate().add(localPoint)
          if (worldDir.lengthSq() > 10e-6) {
            triangleHandler1.vectorToLocal(worldDir, bDirection1)
          }
        }
      }

      const result1 = walker.walk(triangleIndex1, bOrigin1, bDirection1, {
        maxDistance: radius1,
      })

      helper.clear()
      draw(triangleHandler1, bOrigin1, radius1, result1, color1)
    })
  }, [])
  return null
}
