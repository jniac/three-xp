'use client'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Message } from 'some-utils-ts/message'

import { Params } from './page.client'
import s from './page.client.module.css'

function Button({ label = 'Button', onClick = () => { } }) {
  return (
    <button
      className='btn border rounded px-4 py-2'
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export function UI() {
  return (
    <div className={`${s.Client} ui layer thru p-8 flex flex-col gap-4 items-start`}>
      <h1 className='text-2xl font-bold mb-8'>
        Some Shear Examples
      </h1>

      <Button
        label='Orthographic (reset)'
        onClick={() => {
          const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
          controls.vertigo.set({
            perspective: 0,
            zoom: 1,
            rotation: [0, 0, 0],
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

      <Button
        label='Toggle Rotation'
        onClick={() => {
          const params = Message.send(Params).payload
          if (!params)
            return
          params.rotate = !params.rotate
        }}
      />

    </div>
  )
}
