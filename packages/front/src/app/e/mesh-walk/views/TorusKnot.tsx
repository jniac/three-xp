import { useState } from 'react'
import { IcosahedronGeometry, PlaneGeometry, SphereGeometry, TorusKnotGeometry, Vector2 } from 'three'

import { useGroup } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { ObservableNumber } from 'some-utils-ts/observables'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { useTriggerRender } from 'some-utils-react/hooks/render'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { AutoLitWireframeMesh } from '../AutoLitWireframeMesh'
import { SurfaceWalker } from '../surface-walker'

class State {
  angle = 0.3868 * 2 * Math.PI
  autoRotate = false
  walkResult = null as ReturnType<SurfaceWalker['walk']> | null
  walkDuration = 0
}

const presets = {
  knot: {
    geometry: new TorusKnotGeometry(1, .4, 200, 32, 2, 3),
    triangleIndexStart: 932,
  },
  plane: {
    geometry: new PlaneGeometry(2, 2, 10, 10),
    triangleIndexStart: 50,
  },
  ico: {
    geometry: new IcosahedronGeometry(1, 12),
    triangleIndexStart: 0,
  },
  sphere: {
    geometry: new SphereGeometry(1, 32, 16),
    triangleIndexStart: 0,
  },
}

export function TorusKnotGroup(props: TransformDeclaration) {
  useGroup('TorusKnot', props, function* (group) {

    const preset = presets.knot

    setup(new AutoLitWireframeMesh(preset.geometry, { baseColor: 'hsl(240, 50%, 33%)', wireframeColor: 'hsl(240, 50%, 50%)', shadowColor: '#000' }), group)

    const walker = new SurfaceWalker()
    walker.fromGeometry(preset.geometry)

    RandomUtils.setRandom('parkmiller', 983)
    for (let i = 0, max = walker.triangleCount; i < max; i++) {
      walker.rotateVertexIndex(i, RandomUtils.int(3))
    }

    const helper = setup(new DebugHelper(), group)
      .zOffset(.002)
      .xray({ lines: .2 })

    const deltaUV = new Vector2()

    const durationObs = new ObservableNumber(0).initMemorization(50)

    const state = new State()

    yield Message.on('TORUS_KNOT_GET_STATE', m => m.setPayload(state))

    yield onTick('three', tick => {
      // let angle = .6 * 2 * Math.PI
      if (state.autoRotate) {
        state.angle += tick.deltaTime * .001 * 2 * Math.PI
      }
      deltaUV.set(Math.cos(state.angle), Math.sin(state.angle)).multiplyScalar(200)

      const now = performance.now()
      const result = walker.walk(preset.triangleIndexStart, [.333, .333], deltaUV)
      state.walkResult = result
      durationObs.value = performance.now() - now
      state.walkDuration = durationObs.getMemorization().average

      helper.clear()
      helper.polyline([
        result.path[0].getPosition0(),
        ...result.path.map(segment => segment.getPosition1()),
      ], { color: '#ff0', points: { shape: 'circle', size: .025 } })
    })
  }, [])
  return null
}

export function TorusKnotInspector() {
  const [state, setState] = useState<State>()
  const triggerRender = useTriggerRender()

  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    await Ticker.get('three').waitNextTick()

    const state = Message.send('TORUS_KNOT_GET_STATE').assertPayload()
    setState(state)

    yield onTick('three', { timeInterval: .1 }, tick => {
      if (document.activeElement === document.body)
        triggerRender()
    })
  }, [])

  return (
    <div
      ref={ref}
      className='p-4 backdrop-blur-2xl bg-black/30 rounded border border-[#fff6]'
    >
      <h1>
        Torus Knot Walk
      </h1>
      <pre></pre>
      {state && (
        <div className='flex flex-col'>
          <label>
            <input
              className='mr-2'
              type='checkbox'
              checked={state.autoRotate}
              onChange={e => {
                state.autoRotate = e.target.checked
                triggerRender()
              }}
            />
            Auto Rotate
          </label>

          <label>
            Angle (turn)
            <input
              className='mr-2 appearance-none w-16 text-right bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500'
              type='text'
              defaultValue={(state.angle / (2 * Math.PI)).toFixed(4)}
              onChange={e => {
                const value = parseFloat(e.target.value)
                if (Number.isNaN(value) === false) {
                  state.angle = (parseFloat(e.target.value) || 0) * 2 * Math.PI
                }
              }}
              onBlur={() => {
                triggerRender()
              }}
            />
          </label>

          {
            state.walkResult && (
              <div>
                {state.walkResult.path.length} segments walked ({state.walkDuration.toFixed(2)}ms) {state.walkResult.statusString}
              </div>
            )
          }
        </div >
      )
      }
    </div >
  )
}
