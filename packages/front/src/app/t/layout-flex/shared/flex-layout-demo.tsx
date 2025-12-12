import { useEffects } from 'some-utils-react/hooks/effects'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { onTick, Tick, Ticker } from 'some-utils-ts/ticker'
import { ColorRepresentation } from 'three'
import { colorValues } from './colors'

function initFlexLayoutDemoCanvas(parent: HTMLElement, {
  width = 800,
  height = 600,
  scale = .75,
} = {}) {
  const canvas = parent.querySelector('canvas')!
  const pixelRatio = window.devicePixelRatio
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio
  canvas.style.width = `${width * scale}px`
  canvas.style.height = `${height * scale}px`
  canvas.style.border = '1px solid #444'

  const ctx = canvas.getContext('2d')!
  ctx.scale(pixelRatio, pixelRatio)

  const ctxClear = () => {
    ctx.clearRect(0, 0, width, height)
  }

  const ctxRect = ({ x = 0, y = 0, width = 1, height = 1 }, {
    arrow = undefined as Direction | undefined,
    stroke = undefined as string | undefined,
    lineWidth = undefined as number | undefined,
    fill = undefined as string | undefined,
  } = {}) => {
    ctx.fillStyle = stroke ?? fill ?? ''
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
    if (width > 0 && height > 0) {
      ctx.strokeStyle = stroke ?? ''
      ctx.lineWidth = lineWidth ?? 2
      ctx.fillStyle = fill ?? ''
      ctx.beginPath()
      ctx.rect(x, y, width, height)
      if (fill)
        ctx.fill()
      if (stroke)
        ctx.stroke()

      if (arrow)
        ctxRectDirectionArrow(arrow === Direction.Horizontal, { x, y, width, height })
    }
    ctx.globalCompositeOperation = 'destination-over'
  }

  const ctxRectDirectionArrow = (horizontal: boolean, { x = 0, y = 0, width: w = 1, height: h = 1 }) => {
    const m = 5
    const arr_sz = 8
    if (horizontal) {
      const ax = x + w - arr_sz * 3
      const ay = y + h / 2
      const bx = x + w - m
      const by = ay
      ctx.beginPath()
      // ctx.moveTo(ax, ay)
      // ctx.lineTo(bx, by)
      ctx.moveTo(bx - arr_sz, by - arr_sz)
      ctx.lineTo(bx, by)
      ctx.lineTo(bx - arr_sz, by + arr_sz)
      ctx.stroke()
    } else {
      const ax = x + w / 2
      const ay = y + h - arr_sz * 3
      const bx = ax
      const by = y + h - m
      ctx.beginPath()
      // ctx.moveTo(ax, ay)
      // ctx.lineTo(bx, by)
      ctx.moveTo(bx - arr_sz, by - arr_sz)
      ctx.lineTo(bx, by)
      ctx.lineTo(bx + arr_sz, by - arr_sz)
      ctx.stroke()
    }
  }

  return { canvas, ctx, ctxClear, ctxRect }
}

export function CanvasBlock({
  root: rootArg,
  size = [800, 600],
  title,
  description,
  directionArrow,
  computeLayout = (space: Space) => space.computeLayout(),
  colorRule = (space: Space) => colorValues[space.depth() % colorValues.length],
  onStart = undefined,
  tickDisabled = false,
  onTick: onTickArg = undefined,
}: {
  root: Space | Space[]
  size?: [number, number]
  title: React.ReactNode
  description?: React.ReactNode
  directionArrow?: boolean
  computeLayout?: (space: Space) => void
  colorRule?: (space: Space) => ColorRepresentation
  onStart?: (roots: Space[]) => void
  tickDisabled?: boolean
  onTick?: (roots: Space[], tick: Tick) => void
}) {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const [width, height] = size
    const handler = initFlexLayoutDemoCanvas(div, { width, height })

    const roots = Array.isArray(rootArg) ? rootArg : [rootArg]
    const draw = () => {
      handler.ctxClear()

      for (const root of roots) {
        computeLayout(root)

        for (const child of root.allDescendants({ includeSelf: true })) {
          const color = child.userData.color ?? colorRule(child)
          const arrow = directionArrow ? child.direction : undefined
          handler.ctxRect(child.rect, { stroke: color, arrow })
        }
      }
    }

    draw()

    onStart?.(roots)

    if (onTickArg && !tickDisabled) {
      yield handleAnyUserInteraction(Ticker.get('three').set({ inactivityWaitDurationMinimum: 20 }).requestActivation)
      yield onTick('three', tick => {
        onTickArg(roots, tick)
        draw()
      })
    }

  }, 'always')

  return (
    <div ref={ref} className='flex flex-col items-center mt-32'>
      <div>
        <canvas />
      </div>
      <div className='mt-4 flex flex-col items-center gap-2'>
        {title}
      </div>
      {description && (
        <div className='text-sm opacity-70 text-center'>
          {description}
        </div>
      )}
    </div>
  )
}
