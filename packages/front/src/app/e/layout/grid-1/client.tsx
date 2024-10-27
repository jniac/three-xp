'use client'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { Positioning } from 'some-utils-ts/experimental/layout/flex/types'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'

export function Client() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const canvas = div.querySelector('canvas')!
    const pixelRatio = window.devicePixelRatio
    const width = 800
    const height = 600
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')!

    const root = new Space(Direction.Horizontal)
      .setSize(width, height)
      .setSpacing(10)
      .add(
        new Space(Direction.Vertical)
          .setSize('1sh', '1sh')
          .setSpacing(10),
        new Space(Direction.Vertical)
          .setSize('2sh')
          .setSpacing(10),
        new Space(Direction.Vertical)
          .setSize('1sh', '1sh')
          .setSpacing(10)
          .add(
            new Space()
              .setSize('40'),
            new Space()
              .setSize('1sh'),
            new Space()
              .setSize('40'),
            new Space()
              .setSize('1sh')
              .setSpacing(10)
              .add(
                new Space(Direction.Vertical)
                  .setSize('1sh'),
                new Space(Direction.Vertical)
                  .setSize('1sh'),
                new Space(Direction.Vertical)
                  .setSize('1sh'),
              ),
            new Space()
              .setSize('40'),
          ),
        new Space()
          .setPositioning('detached')
          .setUserData({ skipPaint: true })
          .setPadding(10)
          .setSize('1rel')
          .add(
            new Space()
              .setPositioning(Positioning.Detached)
              .setOffset('0rel', '1rel')
              .setSize('.7sm')
          ),
      )

    root.computeLayout()

    function paint() {
      root.computeLayout()
      PRNG.seed(14271)
      ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio)
      for (const space of root.allDescendants({ includeSelf: false })) {
        if (space.userData.skipPaint) continue
        const rect = space.rect.clone().multiplyScalar(pixelRatio)
        ctx.lineWidth = 2 * pixelRatio
        ctx.strokeStyle = PRNG.pick(['#ffcc00', '#cc00ff', '#00ffcc', '#00ccff', '#ffccff'])
        ctx.fillStyle = 'rgba(0, 0, 0, .75)'
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      }
    }

    const ticker = Ticker.get('layout').set({ minActiveDuration: 4 })
    yield handleAnyUserInteraction(ticker.requestActivation)
    yield ticker.onTick(tick => {
      root.get([1])!.sizeX.value = (1 + .3 * Math.sin(tick.time))
      paint()
    })

  }, [])

  return (
    <div ref={ref} className='page flex flex-col'>
      <canvas />
      <p className='text-center'>
        &quot;Detached&quot; space demo.
        <br />
        &quot;Detached&quot; spaces are not included in the layout computation.
      </p>
    </div>
  )
}