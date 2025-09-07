'use client'

import { capitalCase } from 'change-case'

import { useEffects } from 'some-utils-react/hooks/effects'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Message } from 'some-utils-ts/message'
import { Ticker } from 'some-utils-ts/ticker'

import { Params } from './page.client'
import { Button, UIWrapper } from './shared'

function getParams(): Params {
  return Message.send(Params).payload ?? new Params()
}

export function TransformSlider({
  id = 'shear-x',
  min = -1,
  max = 1,
  step = 0.01,
  turnToRadians = false,
}) {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    await Ticker.get('three').waitNextTick()
    const input = div.querySelector('input')!
    const [ka, kb] = id.split('-')
    input.oninput = () => {
      // const value = Number.parseFloat(input.value)
      // getParams().transform.shear[ka][kb] = turnToRadians ? value * 2 * Math.PI : value
    }
    yield Ticker.get('three').onTick({ timeInterval: 1 / 5, }, () => {
      // input.value = String(getParams().transform.shear[ka][kb])
    })
  }, [])
  return (
    <div ref={ref} className='flex flex-row gap-2 items-center'>
      <label htmlFor={id}>{capitalCase(id)}</label>
      <input type="range" id={id} min={min} max={max} step={step} />
    </div>
  )
}

export function UI() {
  return (
    <UIWrapper>
      <h1 className='text-2xl font-bold mb-4'>
        Matrix with Shear
      </h1>

      <p>
        Transform interpolation (lerp) between two random transforms using TransformWithShear (some-utils-three/experimental/transform-with-shear).
      </p>

      <p>
        <span className='text-[#ff99ff]'>Pink color</span> indicates that the two transforms are not both direct or both indirect (reflection).
      </p>

      <p>
        Based on research here:
      </p>
      <ul className='list-disc list-inside'>
        <li>
          <a className='underline hover:text-[cyan]' href='/l/transform-with-shear/0-intro'>0-intro</a>
        </li>
        <li>
          <a className='underline hover:text-[cyan]' href='/l/transform-with-shear/1-shear'>1-shear</a>
        </li>
        <li>
          <a className='underline hover:text-[cyan]' href='/l/transform-with-shear/2-decompose'>2-decompose</a>
        </li>
        <li>
          <a className='underline hover:text-[cyan]' href='/l/transform-with-shear/3-transform-with-shear'>3-transform-with-shear</a>
        </li>
      </ul>

      <div className='basis-2' />

      <Button
        label='Orthographic (reset)'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 0,
            zoom: .98,
            focus: 0,
            rotation: 0,
          })
        }}
      />

      <Button
        label='Perspective'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 1,
          })
        }}
      />

      {/* <Button label='Scale(1,1,1)' onClick={() => getParams().transform.scale.set(1, 1, 1)} /> */}
      {/* <Button label='Shear(0,0,0)' onClick={() => getParams().transform.shear.set(0, 0, 0)} /> */}

    </UIWrapper>
  )
}
