'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { colors } from '../../shared/colors'

export function loopOver<T>(items: ArrayLike<T>): () => T {
  let index = 0
  const length = items.length
  return () => items[index++ % length]
}

export function LayoutInsideFractionDemo() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const canvas = div.querySelector('canvas')!

    const root = new Space({ direction: 'vertical', size: [800, 600], gap: 12 }).add(
      new Space({ name: 'header', size: ['1rel', 64], gap: 12 }),
      new Space({ size: ['1rel', 10] }),
      new Space({ name: 'bottom', size: ['1rel', '1fr'], gap: 12 }).add(
        new Space({ name: 'left', size: ['1fr', '1rel'] }),
        new Space({ size: [10, '1rel'] }),
        new Space({ size: ['1fr', '1rel'] }),
      ),
    )

    root.computeLayout()

    const pixelRatio = window.devicePixelRatio
    canvas.width = 800 * pixelRatio
    canvas.height = 600 * pixelRatio
    canvas.style.width = '800px'
    canvas.style.height = '600px'
    const ctx = canvas.getContext('2d')!

    const colorForSpace = loopOver(Object.values(colors))
    for (const space of root.allLeaves()) {
      ctx.lineWidth = pixelRatio * 2
      ctx.strokeStyle = space.userData.color ?? colorForSpace()
      ctx.strokeRect(...space.rect.tupple(pixelRatio))
    }

  }, [])
  return (
    <div ref={ref} className='flex flex-col items-center gap-4' style={{ flex: '0 0 800px' }}>
      <canvas style={{ border: 'solid 2px #fff1' }} />
      <div className='text-center'>
        <p>
          {`
            A test of layouting spaces inside a fraction unit. Everything is ok. I was
            looking for a bug that was coming from another part of the code.
          `}
          <br />
          {`The test is still there, not very useful now, but can't be reused for something else.`}
        </p>
      </div>
    </div>
  )
}
