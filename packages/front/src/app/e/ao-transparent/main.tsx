'use client'

import { useState } from 'react'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Message } from 'some-utils-ts/message/index'

import { createThree, Three } from './three'

function ThreeCanvas() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const width = div.clientWidth
    const height = div.clientHeight
    const three = createThree({ width, height })
    yield three
    Object.assign(window, { three })
    div.appendChild(three.renderer.domElement)
  }, [])

  return (
    <div
      ref={ref}
      className='absolute inset-0'
    />
  )
}

export function Main() {
  const [aoEnabled, setAoEnabled] = useState(true)
  return (
    <div className='page'>
      <ThreeCanvas />
      <div className='absolute inset-0 p-8 flex flex-col items-start justify-start pointer-through'>
        <div className='flex flex-col items-start justify-start pointer-through max-w-[480px]'>
          <h1 className='text-4xl uppercase'>ao-transparent</h1>
          <div className='mt-4' />
          <p>Handling Ambient Occlusion and transparent objects</p>
          <p>The glass does not generate AO</p>

          <div className='mt-4' />

          <p>
            This is achieved by using a fork of the <a href='https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/GTAOPass.js'>GTAOPass</a>
            &nbsp;where the camera layer mask is set to 0 (default layer) and the glass object is set to layer 1 (transparent objects).
          </p>

          <div className='mt-4' />

          <div>
            <h2 className='text-xl'>Pros:</h2>
            <ul>
              <li>Simple (layer based)</li>
            </ul>
          </div>

          <div className='mt-4' />

          <div>
            <h2 className='text-xl'>Cons:</h2>
            <ul>
              <li>
                AO is still rendered on top of transparent objects.
                For semi-opaque objects, this is could be a problem.
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-4' />

        <div className='flex flex-row gap-2'>
          <label htmlFor='ao-enabled' className='select-none'>Enable AO</label>
          <input
            type='checkbox'
            name='ao-enabled'
            id='ao-enabled'
            checked={aoEnabled}
            onChange={() => {
              const { payload } = Message.send<{ three: Three }>('REQUIRE:THREE')
              if (payload) {
                const { three } = payload
                const { passes } = three
                const { ao } = passes
                ao.enabled = !ao.enabled
                setAoEnabled(ao.enabled)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}