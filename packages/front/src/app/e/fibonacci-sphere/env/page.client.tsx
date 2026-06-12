'use client'
import { IcosahedronGeometry, Mesh, MeshPhysicalMaterial, MeshPhysicalMaterialParameters } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { setup } from 'some-utils-three/utils/tree'

import { MyEnv } from '../MyEnv'

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    const env = setup(new MyEnv(), group)

    env.applyToSceneOnce(three.scene, three.renderer)
    // env.children.forEach((c, i) => c.visible = i === 0)
    env.scale.setScalar(4)

    const sphere = (materialProps?: MeshPhysicalMaterialParameters, transformProps?: TransformDeclaration) => {
      return setup(new Mesh(
        new IcosahedronGeometry(1, 10),
        new MeshPhysicalMaterial({
          metalness: 1,
          roughness: 0,
          ...materialProps,
        }),
      ), {
        parent: group,
        ...transformProps,
      })
    }

    sphere()
    sphere({ roughness: .25 }, { x: -2.2 })
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 5,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}