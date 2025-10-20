'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { onTick } from 'some-utils-ts/ticker'

import { CanvasContext } from '../canvas-context'
import { colors } from '../colors'

export function BasicMarginDemo() {
  const margin4 = [10, 30, 90, 0] as [number, number, number, number]
  const margin2 = [10, 80] as [number, number]

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const context = new CanvasContext(div.querySelector('canvas')!)

    const root = new Space({
      direction: Direction.Horizontal,
      size: [context.width, context.height],
      spacing: 10,
      alignChildren: 1,
    })
      .add(
        new Space({ userData: { color: colors.yellow } })
          .add(
            new Space({ margin: margin4, userData: { color: colors.yellow } })
              .add(
                new Space({ margin: margin4, userData: { color: colors.yellow } })
                  .add(
                    new Space({ margin: margin4, userData: { color: colors.yellow } })
                      .add(
                        new Space({ margin: margin4, userData: { color: colors.yellow } })
                          .add(
                            new Space({ margin: margin4, userData: { color: colors.yellow } })
                          ),
                      ),
                  ),
              ),
          ),
        new Space({ userData: { color: colors.paleGreen } })
          .add(
            new Space({ margin: margin2, userData: { color: colors.paleGreen } })
          ),
        new Space({ padding: 10, userData: { color: colors.magenta } })
          .add(
            new Space({ margin: [0, 60], marginRight: 0, userData: { color: colors.magenta } }),
            new Space({ margin: [0, 60], marginLeft: 0, userData: { color: colors.magenta } }),
          ),
      )

    yield onTick('layout', tick => {
      root.get(2)?.set({ padding: 10 + 40 * tick.sin01Time({ frequency: 1 / 5 }) })
      context.paint(root)
    })

  }, [])

  return (
    <div ref={ref} className='flex flex-col justify-center gap-4' style={{ flex: '0 0 800px' }}>
      <canvas style={{ border: 'solid 2px #fff1' }} />
      <div className='text-center'>
        <h1>
          css-like margins:
        </h1>
        <ul>
          <li style={{ color: colors.yellow }}>
            4 values ({margin4.join(', ')}) (top, right, bottom, left)
          </li>
          <li style={{ color: colors.paleGreen }}>
            2 values ({margin2.join(', ')}) (vertical, horizontal)
          </li>
          <li style={{ color: colors.magenta }}>
            specific overrides: <code>marginLeft</code> overrides &quot;2 values&quot; declaration
          </li>
        </ul>
      </div>
    </div>
  )
}
