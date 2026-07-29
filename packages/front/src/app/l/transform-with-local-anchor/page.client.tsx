'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { BoxFrameGeometry } from 'some-utils-three/geometries/BoxFrameGeometry'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { BoxGeometry, Mesh, Object3D, Quaternion, Vector3 } from 'three'

function setTransformWithLocalPivot(
  object: Object3D,
  localPivot: Vector3,
  position: Vector3,
  quaternion: Quaternion,
  scale: Vector3,
) {
  object.quaternion.copy(quaternion)
  object.scale.copy(scale)
  object.position
    .copy(localPivot)
    .multiply(scale)
    .applyQuaternion(quaternion)
    .negate()
    .add(position)
  object.updateMatrixWorld()
}

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid()

    const cube = setup(new Mesh(new BoxGeometry(), new AutoLitMaterial()), group)

    const localAnchor = new Vector3(0, -.5, .5)
    setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), {
      parent: cube,
      position: localAnchor,
    })

    yield three.ticker.onTick(tick => {
      const quaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, .3).normalize(), tick.time)
      setTransformWithLocalPivot(cube, localAnchor,
        new Vector3(-2, -1, 0),
        quaternion,
        new Vector3(6, 4, 2))
    })

    setup(new Mesh(
      new BoxFrameGeometry({ width: 6, height: 4, depth: 2, borderWidth: .2, borderAlign: 0 }),
      new AutoLitMaterial({ side: 2, color: '#fc0' })), {
      parent: group,
      position: [8, 0, -1],
    })
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}