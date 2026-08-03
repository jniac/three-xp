'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { Header } from '../../me/home/home'
import { WaterGroup } from './WaterGroup'

function MyGroup() {
  const three = useThreeWebGL()
  useGroup('my-group', function* (group) {
    setup(new DebugHelper(), group)
    // .regularGrid()

    const waterGroup = setup(new WaterGroup(), group)
    waterGroup.onInitialize(three)

  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: [1, 10],
        inputDOF: 'fixed',
      }}
    >
      <div className='p-4'>
        <Header />
      </div>
      <MyGroup />
    </ThreeProvider>
  )
}