'use client'

import { BufferGeometry, ConeGeometry, CylinderGeometry, InstancedMesh } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

import { InspectorView } from 'some-utils-misc/inspector'
import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { VertigoHelper } from 'some-utils-three/camera/vertigo/helper'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setVertexColors } from 'some-utils-three/utils/geometry/vertex-colors'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { cos01, lerp, sin01 } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

import { leak } from '@/utils/leak'


class PineGeometry extends BufferGeometry {
  constructor() {
    super()
    const cone1 = setVertexColors(
      new ConeGeometry(1.5, 2, 32, 1, true).translate(0, 3.75, 0),
      '#369674')
    const cone2 = setVertexColors(
      new ConeGeometry(1.85, 2.35, 32, 1, true).translate(0, 3.05, 0),
      '#29795d')
    const cone3 = setVertexColors(
      new ConeGeometry(2, 3, 32, 1, true).translate(0, 2.5, 0),
      '#1a5842')
    const trunk = setVertexColors(
      new CylinderGeometry(0.25, 0.5, 3, 32).translate(0, 1.5, 0),
      '#8b5a2b')

    const master = BufferGeometryUtils.mergeGeometries([
      cone1,
      cone2,
      cone3,
      trunk,
    ])

    this.setAttribute('position', master.attributes.position)
    this.setAttribute('normal', master.attributes.normal)
    this.setAttribute('color', master.attributes.color)
    this.setIndex(master.index)
  }
}

class Forest extends InstancedMesh {
  constructor(pineCount = 200) {
    super(
      new PineGeometry(),
      new AutoLitMaterial({ vertexColors: true, side: 2 }),
      pineCount)

    R.setRandom('parkmiller')

    for (let i = 0; i < pineCount; i++) {
      this.setMatrixAt(i, makeMatrix4({
        x: R.number(-50, 50),
        z: R.number(-50, 50),
        scale: 2 ** R.number(-1, 0),
      }))
    }
  }
}

class MyState {
  autoRotate = true
  static rotateSpeed = { type: 'number slider(.1, 10) middle(1)', }
  rotateSpeed = 1
  useVertigo = false
  static jumpLessSubjectivity = { type: 'number slider(0, 1)', }
  jumpLessSubjectivity = 1
}

function MyScene() {
  useGroup('my-scene', function* (group, three) {
    setup(new Forest(100), group)

    setup(new DebugHelper(), group)
      .regularGrid({ plane: 'xz' })

    const planeCenterHelper = setup(new DebugHelper().onTop(), group)

    const myState = new MyState()
    Message.expose('MY_STATE', myState)

    const myVertigo = new Vertigo({
      focus: [2, 2, 0],
      perspective: 1,
      subjectivity: 1,
    })
    Message.expose('MY_VERTIGO', myVertigo)

    const vertigoHelper = setup(new VertigoHelper(myVertigo, { frustum: 'focus-as-far' }), group)

    const controls = Message.requireInstance(VertigoControls)

    let myStateUseVertigoOld = myState.useVertigo
    const vertigoControlsOld = new Vertigo(myVertigo)

    const state = {
      time: 0,
    }

    yield three.ticker.onTick(tick => {
      myState.jumpLessSubjectivity = myVertigo.subjectivity

      if (myState.autoRotate) {
        state.time += tick.deltaTime * myState.rotateSpeed
        const rx = lerp(-20, 20, sin01(state.time / 5))
        const ry = lerp(-20, 20, cos01(state.time / 5))
        const rz = myVertigo.rotation.z * (180 / Math.PI)
        vertigoHelper.vertigo.set({
          rotation: `${rx}deg, ${ry}deg, ${rz}deg`,
        })
      }
      vertigoHelper.vertigo.update(three.aspect)

      planeCenterHelper
        .clear()
        .box({ min: 0, max: myVertigo.state.focusPlaneCenter }, { color: '#6fc' })

      if (myState.useVertigo && myStateUseVertigoOld === false) {
        vertigoControlsOld.set(controls.vertigo)
      }
      if (myState.useVertigo === false && myStateUseVertigoOld) {
        controls.set(vertigoControlsOld)
      }
      if (myState.useVertigo) {
        controls.set(vertigoHelper.vertigo)
      }
      myStateUseVertigoOld = myState.useVertigo
    })
  }, [])
  return null
}

function MainInspector() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const myState = await Message.waitFor<MyState>('MY_STATE')
    const inspector = new InspectorView({ header: { title: 'Main Inspector' } })
    inspector.registerFields([
      ...InspectorView.inferFields(myState),
      {
        key: 'toggle-subjectivity',
        type: 'button',
        value: () => {
          const myVertigo = Message.require<Vertigo>('MY_VERTIGO')
          myVertigo.swapSubjectivity(myVertigo.subjectivity === 0 ? 1 : 0)
        },
      }
    ], {
      updatedValues() {
        return myState
      },
    })
    inspector.onAnyChange((key, value) => {
      if (key === 'jumpLessSubjectivity') {
        const myVertigo = Message.require<Vertigo>('MY_VERTIGO')
        myVertigo.swapSubjectivity(value)
      }
      InspectorView.tryApplyChange(key, value, myState)
    })
    div.replaceChildren(inspector.div)
  }, [])
  return (
    <div
      ref={ref}
      className='p-2 rounded border border-[#fff1] bg-[#11111199] backdrop-blur-lg'
    />
  )
}

function VertigoInspector() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const myVertigo = await Message.waitFor<Vertigo>('MY_VERTIGO')
    const inspector = new InspectorView({ header: { title: 'Vertigo Inspector' } })
      .generateFields(myVertigo, Vertigo.propsMeta)
    yield inspector.onAnyChange((key, value) => {
      myVertigo.set({ [key]: value })
    })
    div.replaceChildren(inspector.div)
  }, [])
  return (
    <div
      ref={ref}
      className='p-2 rounded border border-[#fff1] bg-[#11111199] backdrop-blur-lg'
    />
  )
}

function UI() {
  return (
    <div className={`
      layer thru p-4
      flex flex-col gap-2 items-start justify-start
    `}>
      <h1 className='text-2xl font-bold'>
        Subjectivity Demo
      </h1>
      <MainInspector />
      <VertigoInspector />
    </div>
  )
}

export default function PageClient() {
  leak()
  return (
    <ThreeProvider
      vertigoControls={{
        size: 50,
        rotation: '-30deg, 45deg, 0',
      }}
    >
      <UI />
      <MyScene />
    </ThreeProvider>
  )
}
