'use client'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Message } from 'some-utils-ts/message'

import s from './page.client.module.css'

export function UI() {
  return (
    <div className={`${s.Client} ui layer thru p-8 flex flex-col gap-4 items-start`}>
      <h1 className='text-2xl font-bold mb-8'>
        Some Shear Examples
      </h1>

      <button
        className='btn border rounded px-4 py-2'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 0,
            zoom: 1,
            rotation: [0, 0, 0],
          })
        }}
      >
        Orthographic (reset)
      </button>

      <button
        className='btn border rounded px-4 py-2'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 1,
          })
        }}
      >
        Perspective
      </button>
    </div>
  )
}
