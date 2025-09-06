'use client'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Message } from 'some-utils-ts/message'
import { Button, UIWrapper } from '../shared'
import { Params } from './page.client'


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

      <Button
        label='Negate Matrix'
        onClick={() => {
          const params = Message.send<Params>(Params).payload
          if (params)
            params.negateMatrix = !params.negateMatrix
        }}
      />

      <p className='mt-4'>
        Using <code>TransformWithShear</code> from <code>some-utils-three/experimental/transform-with-shear</code>.
      </p>
      <p>
        The <span className='text-yellow-500'>yellow object</span> is defined by position, rotation, scale, and shear (transform props).
      </p>
      <p>
        The <span className='text-cyan-500'>cyan object</span> is defined by basis vectors (matrix), transform is inferred from matrix.
      </p>
      <p>
        Works with reflections too (try clicking &quot;Negate Matrix&quot; button).
      </p>
    </UIWrapper>
  )
}
