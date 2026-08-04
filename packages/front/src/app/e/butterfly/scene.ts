import { Color, Mesh, Texture } from 'three'
import { MSDFTextGeometry } from 'three-msdf-text-utils'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { TransformTool } from 'some-utils-three/objects/tools'
import { setup } from 'some-utils-three/utils/tree'
import { find } from 'some-utils-three/utils/tree/find'

import geistMonoData from '@/fonts/msdf/geist/geist-mono-latin-600-normal-msdf-atlas.png?base64'
import geistMonoJson from '@/fonts/msdf/geist/geist-mono-latin-600-normal-msdf.json'

import { Umbellifer } from '../me/about/umbellifer'
import { Butterfly } from './Butterfly'
import { MSDFMaterial, MSDFTextMesh } from './MSDF'

export function getHelloMesh() {
  const geometry = new MSDFTextGeometry({
    text: 'Hello',
    font: geistMonoJson,
  })

  const image = new Image()
  image.src = geistMonoData
  image.onload = () => {
    atlasTexture.needsUpdate = true
  }
  const atlasTexture = new Texture(image)
  atlasTexture.needsUpdate = true

  const material = new MSDFMaterial()
  material.uniforms.uColor.value.set('#220793')
  material.uniforms.uMap.value = atlasTexture

  const mesh = new Mesh(geometry, material)
  mesh.scale.setScalar(1 / 50)
  mesh.rotation.x = -Math.PI
  mesh.position.set(-10.2, 0, 0)

  return mesh
}

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', async function* (group) {
    setup(new DebugHelper(), group)
      // .regularGrid()
      .regularGrid({ subdivisions: [30], opacity: [.01] })

    three.scene.background = new Color('hsl(257, 24%, 6%)')

    setup(new Butterfly({ color: 'white' }), {
      position: [0, 1.5, 2.4],
      rotation: [.3, .02, .53],
      parent: group,
    })

    setup(new Butterfly(), {
      position: [5.45, -3.90, 1.01],
      rotation: [.82, 1.25, -.07],
      parent: group,
    })

    yield three.ticker.onTick(tick => {
      for (const child of group.children) {
        if (child instanceof Butterfly) {
          child.update(tick.deltaTime)
        }
      }
    })

    setup(getHelloMesh(), group)

    setup(new MSDFTextMesh('MSDF text here.', {
      color: '#e8e8e8',
    }), {
      parent: group,
      position: [-10, -1, 0],
    })

    setup(new Umbellifer({
      seed: 1234,
      scaleFactor: 8,
      lineWidthFactor: 1.5,
      splitIndices: [[2], [1]],
      stemColor: 'hsl(249, 27%, 56%)',
      leafColor: '#e8e8e8',
    }), {
      position: [4.6, -17.4, -3.8],
      rotation: [.19, .47, 0],
      parent: group,
    })

    if (false) {
      const tool = setup(new TransformTool(), group)
      // tool.attach(find(group, Umbellifer)!, { localPivot: [0, 20, 0] })
      tool.attach(find(group, Butterfly)!)
    }
  }, [])
  return null
}