'use client'
import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { createAsyncContext } from 'some-utils-react/contexts/async-context'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { anyLoader } from 'some-utils-three/loaders/any-loader'
import { GaussianMipmapGenerator } from 'some-utils-three/textures/GaussianMipmapGenerator'
import { setup } from 'some-utils-three/utils/tree'

const [AssetsProvider, useAssets] = createAsyncContext(async () => {
  return {
    texture: await anyLoader.loadTexture('/assets/images/test-2.jpg'),
  }
})

function MyScene() {
  const [assets] = useAssets()
  const three = useThreeWebGL()

  useGroup('my-scene', async function* (group) {
    setup(new DebugHelper(), group)
      .onTop()
      .regularGrid()

    setup(new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial({
        side: 2,
        map: assets.texture,
      }),
    ), {
      parent: group,
      position: [-1, -1, 0],
    })

    const generator = new GaussianMipmapGenerator()

    const mips = generator.generateMipmaps(
      three.renderer,
      assets.texture,
      7,        // kernel size
      1024,     // width
      1024,     // height
      2,
    )
    setup(new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial({
        side: 2,
        map: mips[2].texture,
      }),
    ), {
      parent: group,
      position: [1, -1, 0],
    })

    console.time('generateMipmapsToTexture')
    const combinedTexture = generator.generateMipmapsToTexture(
      three.renderer,
      assets.texture,
      7,        // kernel size
      256,     // width
      256,     // height
    )
    console.timeEnd('generateMipmapsToTexture')

    setup(new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial({
        side: 2,
        map: assets.texture,
      }),
    ), {
      parent: group,
      position: [-1, 1, 0],
    })
    setup(new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial({
        side: 2,
        map: combinedTexture,
      }),
    ), {
      parent: group,
      position: [1, 1, 0],
    })
  }, [])

  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 4.6,
        after: 100,
      }}
    >
      <h1 className='p-4 text-2xl font-bold'>
        Gaussian Mipmap Generator
      </h1>
      <AssetsProvider>
        <MyScene />
      </AssetsProvider>
    </ThreeProvider>
  )
}
