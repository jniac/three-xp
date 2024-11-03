'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { Positioning } from 'some-utils-ts/experimental/layout/flex/types'

import { CanvasContext } from '../canvas-context'
import { colors } from '../colors'

export function MarginCollapseDemo() {
  const marginToColor = (margin: number) => {
    switch (margin) {
      case 40: return colors.magenta
      case 120: return colors.paleGreen
      default: return colors.yellow
    }
  }

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const context = new CanvasContext(div.querySelector('canvas')!)

    function margin(value: number) {
      return {
        userData: { color: marginToColor(value) },
        margin: value,
      }
    }

    const root = new Space({
      direction: Direction.Horizontal,
      size: [context.width, context.height],
      spacing: 10,
      alignChildren: 1,
    })
      .add(
        new Space({ spacing: 10, userData: { color: '#fff2' } })
          .add(
            new Space({ ...margin(0) }),
            new Space({ ...margin(0) }),
            new Space({ ...margin(40) }),
            new Space({ ...margin(40) }),
            new Space({ ...margin(120) }),
            new Space({ ...margin(0) }),
          )
      )

    root.get(0, 2)?.add(
      new Space({
        positioning: Positioning.Detached,
        alignSelf: 0,
        size: [38, 38],
        offset: [-39, -39],
        userData: { color: '#fff2', plain: true },
      }),
    )

    root.get(0, 4)?.add(
      new Space({
        positioning: Positioning.Detached,
        alignSelf: 0,
        size: [118, 118],
        offset: [-119, -119],
        userData: { color: '#fff2', plain: true },
      }),
    )

    context.paint(root)
  }, [])

  return (
    <div ref={ref} className='flex flex-col justify-center gap-4' style={{ flex: '0 0 800px' }}>
      <canvas style={{ border: 'solid 2px #fff1' }} />
      <div className='text-center'>
        <p>
          Margins &quot;collapse&quot; when they are adjacent to each other or to
          the edge (padding) of the container.
        </p>
        <p style={{ color: marginToColor(0) }}>margin: 0</p>
        <p style={{ color: marginToColor(40) }}>margin: 40</p>
        <p style={{ color: marginToColor(120) }}>margin: 120</p>
      </div>
    </div>
  )
}
