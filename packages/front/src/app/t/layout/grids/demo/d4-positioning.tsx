'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Direction, Positioning, Space } from 'some-utils-ts/experimental/layout/flex'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { CanvasContext } from '../../shared/canvas-context'
import { colors } from '../../shared/colors'

export function PositioningDemo() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const context = new CanvasContext(div.querySelector('canvas')!)

    PRNG.reset()

    const root = new Space({
      direction: Direction.Horizontal,
      size: [context.width, context.height],
      spacing: 10,
      userData: { color: colors.blue },
    })
      .add(
        new Space({
          direction: Direction.Vertical,
          size: '1part',
          spacing: 10,
          userData: { color: colors.paleGreen },
        })
          .populate(5, { spacing: 10 }),
        new Space({
          direction: Direction.Vertical,
          size: '2sh',
          userData: { color: colors.magenta },
          spacing: 10,
        }),
        new Space({
          direction: Direction.Vertical,
          size: '1part',
          spacing: 10,
        })
          .add(
            new Space()
              .setSize('40'),
            new Space()
              .setSize('1part'),
            new Space()
              .setSize('40'),
            new Space()
              .setSize('1part')
              .setSpacing(10)
              .add(
                new Space({ direction: 'vertical', size: '1part' }),
                new Space({ direction: 'vertical', size: '1part' }),
                new Space({ direction: 'vertical', size: '1part' }),
              ),
            new Space()
              .setSize('40'),
          ),
        new Space()
          .setPositioning('detached')
          .setUserData({ skipPaint: true })
          .setPadding(20)
          .setSize('1rel')
          .add(
            new Space({
              positioning: Positioning.Detached,
              offset: ['0rel', '1rel'],
              size: '.7sm',
            })
          ),
      )

    root.get(0, 3)!.populate(3)

    root.get(1)!.add(
      new Space({
        positioning: Positioning.Detached,
        direction: Direction.Vertical,
        size: 90,
        spacing: 10,
      })
        .populate(4),
      new Space({
        positioning: Positioning.Detached,
        alignSelf: 0,
        offset: [0, 0],
        size: 70,
        spacing: 10,
      })
        .populate(3),
      new Space({
        positioning: Positioning.Detached,
        alignSelf: [0, 1],
        size: 30,
        spacing: 10,
      })
        .populate(1),
      new Space({
        positioning: Positioning.Detached,
        alignSelf: 1,
        size: 50,
        spacing: 10,
      })
        .populate(2),
    )

    const lol = new Space({
      positioning: Positioning.Detached,
      size: 30,
    })
      .populate(3)
      .addTo(root.get(0, 3)!)

    for (const child of root.allDescendants({ includeSelf: true })) {
      if (child.positioning === Positioning.Detached) {
        child.set({ userData: { color: colors.yellow } })
      }
    }

    root.computeLayout()

    yield onTick('layout', tick => {
      root.get([0])!.sizeX.value = tick.lerpCos01Time(2, 1, { frequency: 1 / 6 })
      root.get([1])!.sizeX.value = tick.lerpCos01Time(0, 4, { frequency: 1 / 6 })
      lol.set({
        alignSelf: tick.sin01Time({ frequency: 1 / 3 }),
      })
      context.paint(root)
    })
  }, [])

  return (
    <div ref={ref} className='flex flex-col justify-center gap-4' style={{ flex: '0 0 800px' }}>
      <canvas style={{ border: 'solid 2px #fff1' }} />
      <div className='text-center'>
        <p>
          When positioning is set to <code style={{ color: colors.yellow }}>detached</code>, spaces are not affected by their parent&apos;s size.
        </p>
      </div>
    </div>
  )
}
