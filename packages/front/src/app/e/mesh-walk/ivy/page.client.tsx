'use client'
import { IcosahedronGeometry, Mesh, Object3D, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { applyStringMatcher } from 'some-utils-ts/string/match'
import { StringMatcher } from 'some-utils-ts/types'
import { HashMap } from '../surface-walker/hash-map'

async function extractFromGltf<T extends Object3D>(url: string, name: StringMatcher, type: new (...args: any[]) => T) {
  const gltfLoader = new GLTFLoader()
  const gltf = await gltfLoader.loadAsync(url)
  let foundMesh: T | null = null
  gltf.scene.traverse(child => {
    if (child instanceof type && applyStringMatcher(child.name, name)) {
      foundMesh = child
    }
  })
  if (!foundMesh) {
    throw new Error(`Mesh with name matching "${name}" not found in ${url}`)
  }
  return foundMesh as T
}

function MyScene() {
  const group = useGroup('MyScene', { rotationX: '-90deg' }, async function* () {
    const chapel = await extractFromGltf('/assets/meshes/Chapel.glb', 'Walls', Mesh)
    chapel.material = new AutoLitMaterial({ color: 'hsl(36, 12%, 54%)' })
    setup(chapel, group)

    const origin = new Vector3(-3.5, -4.6, 0)
    const helper = setup(new DebugHelper(), group)
    helper.point(origin)

    const g = new IcosahedronGeometry(1, 0)
    const hm = new HashMap<Vector3, number>({
      hash: ({ x, y, z }) => x * 10000 + y * 100 + z,
      equals: (v1, v2) => v1.x === v2.x && v1.y === v2.y && v1.z === v2.z,
      clone: v => v.clone(),
    })
    const pa = g.attributes.position.array as Float32Array
    for (let i = 0; i < pa.length; i += 3) {
      const v = new Vector3(pa[i], pa[i + 1], pa[i + 2])
      hm.set(v, 1)
    }
    console.log('Unique vertices:', hm.size)
    for (const key of hm.keys()) {
      helper.line(origin, origin.clone().add(key), { color: 'red' })
    }
    console.log([...hm.keys().flatMap(v => [v.x, v.y, v.z])].join(', '))
  }, [])
  return null
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false

  useGroup('ThreeSettings', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ opacity: [.1, .02], plane: 'xz' })

    setup(new SkyMesh({ color: 'rgb(39, 39, 54)' }), group)
  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 12,
        rotation: '-30deg, -30deg, 0',
      }}>
      <ThreeSettings />
      <MyScene />
    </ThreeProvider>
  )
}