'use client'
import { Group, Mesh, TorusGeometry } from 'three'

import { AutolitMaterial } from '@/misc/env-room/materials/autolit'
import { InspectorView } from 'some-utils-misc/inspector'
import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { Tick } from 'some-utils-ts/ticker'

class MyScene extends Group {
  torus = setup(new Mesh(new TorusGeometry(1, 0.4, 32, 100), new AutolitMaterial()), this)

  state = new class {
    autoRotate = true
    static torusSize = {
      type: 'number slider(0.5, 2, 0.01)'
    }
    torusSize = 1
  }

  constructor() {
    super()
    Message.exposeInstance(MyScene, this)
  }

  onTick(tick: Tick) {
    if (this.state.autoRotate) {
      this.torus.rotation.y += 1 * tick.deltaTime
    }
    this.torus.scale.setScalar(this.state.torusSize)
  }
}

function MySceneGroup() {
  useGroup('my-scene-group', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid()

    setup(new MyScene(), group)
  }, [])
  return null
}

function UI() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const myScene = await Message.waitForInstance(MyScene)
    const inspector = new InspectorView
    inspector.registerFields([
      ...InspectorView.inferFields(myScene.state),
      {
        key: 'torus.position',
        type: 'vector(x,y,z) widget(translate-3d)',
        value: myScene.torus.position,
      },
      {
        key: 'reset-torus-rotation',
        type: 'button',
        value: () => {
          myScene.torus.rotation.set(0, 0, 0)
        },
      }
    ], {
      updatedValues() {
        return {
          'torus.position': myScene.torus.position,
        }
      },
    })
    inspector.onAnyChange((key, value) => {
      InspectorView.tryApplyChange(key, value, [myScene, myScene.state])
    })
    div.querySelector<HTMLDivElement>('.Inspector div')
      ?.replaceChildren(inspector.div)
  }, [])
  return (
    <div
      ref={ref}
      className='p-16 flex flex-col gap-4 items-start justify-start'
    >
      <h1 className='text-2xl font-bold'>
        Inspector
      </h1>
      <div className='Inspector p-2 border border-[#fff2] rounded-md backdrop-blur-sm bg-[#ffffff05]'>
        <div></div>
      </div>
    </div>
  )
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MySceneGroup />
      <UI />
    </ThreeProvider>
  )
}