'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { colors } from '../colors'


export function BasicLayoutDemo() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const canvas = div.querySelector('canvas')!

    const root = new Space({
      direction: Direction.Horizontal,
      offset: [100, 100],
      size: [600, 400],
      padding: 10,
      gap: 10,
      userData: { color: colors.yellow },
    })

    // Creates 2 vertical spaces with 25% width and 100% height
    root.add(
      new Space({
        direction: Direction.Vertical,
        size: ['.25rel', '1rel'],
        spacing: 10,
        userData: { color: colors.paleGreen },
      }),
      new Space({
        direction: Direction.Vertical,
        size: ['.25rel', '1rel'],
        spacing: 10,
        userData: { color: colors.paleGreen },
      }),
      new Space({
        direction: Direction.Vertical,
        size: ['.25rel', '1rel'],
        spacing: 10,
        userData: { color: colors.paleGreen },
      })
    )

    // Creates 3 spaces into the first vertical space, with 1fr, 2fr and 3fr height
    // where fr is a special unit that means "fraction" of the remaining space
    for (let i = 0; i < 3; i++) {
      root.get(0)!.add(
        new Space({
          size: `${i + 1}fr`,
          spacing: 10,
        })
      )
    }

    root.computeLayout()

    const pixelRatio = window.devicePixelRatio
    canvas.width = 800 * pixelRatio
    canvas.height = 600 * pixelRatio
    canvas.style.width = '800px'
    canvas.style.height = '600px'
    const ctx = canvas.getContext('2d')!
    for (const space of root.allDescendants({ includeSelf: true })) {
      ctx.lineWidth = pixelRatio * 2
      ctx.strokeStyle = space.userData.color ?? '#fff'
      ctx.strokeRect(...space.rect.tupple(pixelRatio))
    }

  }, [])
  return (
    <div ref={ref} className='flex flex-col justify-center gap-4' style={{ flex: '0 0 800px' }}>
      <canvas style={{ border: 'solid 2px #fff1' }} />
      <div className='text-center'>
      </div>
    </div>
  )
}
