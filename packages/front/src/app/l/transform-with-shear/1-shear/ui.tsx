'use client'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Message } from 'some-utils-ts/message'

import { Button, UIWrapper } from '../shared'

export function UI() {
  return (
    <UIWrapper>
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

      <p className='max-w-sm'>
        Using <code>TransformWithShear</code> from <code>some-utils-three/experimental/transform-with-shear</code>.
      </p>
    </UIWrapper>
  )
}
