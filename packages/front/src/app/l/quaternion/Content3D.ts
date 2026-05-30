import { AlwaysDepth, ConeGeometry, Mesh, Quaternion, Vector3 } from 'three'

import { useGroup } from 'some-utils-misc/three-provider'
import { fromEulerDeclaration } from 'some-utils-three/declaration'
import { RoundedAxesGeometry } from 'some-utils-three/geometries/RoundedAxesGeometry'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { DynamicInstancedMesh } from 'some-utils-three/objects/DynamicInstancedMesh'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'

const _v0 = new Vector3()
const _v1 = new Vector3()
const _q0 = new Quaternion()

export function Content3D() {
  useGroup('content3d', function* (group, three) {
    setup(new DebugHelper().regularGrid(), group)

    setup(new Mesh(
      new RoundedAxesGeometry(),
      new AutoLitMaterial({ vertexColors: true }),
    ), group)

    const q1 = new Quaternion().setFromEuler(fromEulerDeclaration('0deg, 90deg, -50deg'))
    const q2 = new Quaternion().setFromEuler(fromEulerDeclaration('30deg, 0deg, -50deg'))

    const coneGeometry = new ConeGeometry(0.1, 1, 32).translate(0, 0.5, 0)
    const cone1 = setup(new Mesh(coneGeometry, new AutoLitMaterial({ color: 'white' }),), {
      parent: group,
      position: [1, 2, 0],
    })
    const cone2 = setup(new Mesh(coneGeometry, new AutoLitMaterial({ color: 'white' }),), {
      parent: cone1,
      position: [0, 1, 0],
    })

    const quaternionsHelper = setup(new DynamicInstancedMesh(
      new RoundedAxesGeometry().scale(0.2, 0.2, 0.2),
      new AutoLitMaterial({ vertexColors: true, depthFunc: AlwaysDepth }),
    ), group)

    yield three.ticker.onTick(() => {
      quaternionsHelper.clear()
      quaternionsHelper.addInstance(makeMatrix4({
        position: cone1.getWorldPosition(_v0),
        quaternion: q1,
      }))
      quaternionsHelper.addInstance(makeMatrix4({
        position: cone2.getWorldPosition(_v0),
        quaternion: q2,
      }))

      cone1.quaternion.copy(q1)
      cone2.quaternion.copy(q1).invert().multiply(q2)
    })

  }, [])
  return null
}