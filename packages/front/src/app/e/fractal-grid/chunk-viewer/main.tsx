'use client'

import { Group, IcosahedronGeometry, Mesh } from 'three'

import { ThreeInstance, ThreeProvider } from 'some-utils-misc/three-provider'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'

import { FractalGridChunk } from '../voxel/chunk'

class MainGroup extends Group {
  parts = (() => {
    const mesh = setup(new Mesh(new IcosahedronGeometry(), new AutoLitMaterial()), {
      parent: this,
      userData: {
        onPointerTap: () => alert('Hello, world!'),
      }
    })

    const line = setup(new LineHelper(), this)
    line.grid2().draw()

    const chunk = new FractalGridChunk()
    setup(chunk, this)

    return { mesh, line }
  })()

  onTick(tick: Tick) {
    const { mesh } = this.parts
    mesh.rotation.y += tick.deltaTime
  }
}

export function Main() {
  return (
    <ThreeProvider webgl vertigoControls={{ size: 20 }}>
      <div className='Main layer thru flex flex-col items-start justify-start p-4'>
        <h1>Chunk Viewer</h1>
        <ThreeInstance value={MainGroup} />
      </div>
    </ThreeProvider>
  )
}
