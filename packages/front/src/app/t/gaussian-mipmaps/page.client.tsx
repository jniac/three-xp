'use client'
import { Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three'

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

    const helper = setup(new DebugHelper(), group)

    const plane = (map: Texture, x: number, y: number, text?: string) => {
      x += -2
      setup(new Mesh(
        new PlaneGeometry(2, 2),
        new MeshBasicMaterial({
          side: 2,
          map,
        }),
      ), {
        parent: group,
        position: [x, y, 0],
      })
      helper.text([x, y - .9, 0], text ?? '', { backgroundColor: '#00f', textColor: '#fff', size: .333 })
    }

    plane(assets.texture, -1, -1, 'original')

    const generator = new GaussianMipmapGenerator()

    const mips = generator.generateMipmaps(
      three.renderer,
      assets.texture,
      7,        // kernel size
      1024,     // width
      1024,     // height
      2,
    )
    for (let i = 0; i < mips.length; i++) {
      plane(mips[i].texture, i * 2 + 1, -1, `mips[${i}]`)
    }

    console.time('generateMipmapsToTexture')
    const combinedTexture = generator.generateMipmapsToTexture(
      three.renderer,
      assets.texture,
      7,        // kernel size
      256,     // width
      256,     // height
    )
    console.timeEnd('generateMipmapsToTexture')

    plane(assets.texture, -1, 1, 'original')
    plane(combinedTexture, 1, 1, 'combined')
  }, [])

  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 8.6,
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
