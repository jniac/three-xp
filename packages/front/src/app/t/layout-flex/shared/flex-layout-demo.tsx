import { ColorRepresentation } from 'three'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { useEffects } from 'some-utils-react/hooks/effects'
import { fromVector2Declaration, Vector2Declaration } from 'some-utils-three/declaration'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { onTick, Tick, Ticker } from 'some-utils-ts/ticker'

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

  const ctxSpace = (space: Space, options?: Parameters<typeof ctxRect>[1]) => {
    if (space.userData.skipDraw)
      return

    if (space.userData.alpha !== undefined)
      ctx.globalAlpha = space.userData.alpha

    ctxRect(space.rect, {
      ...options,
      fitHorizontal: space.sizeXFitContent,
      fitVertical: space.sizeYFitContent,
      center: space.userData.drawCenter,
      diagonals: (options?.diagonals && space.isLeaf()) || space.userData.drawDiagonals,
      sizeBars: space.userData.drawSizeBars,
      lateralHandles: space.userData.drawLateralHandles,
      quadrants: space.userData.drawQuadrants,
      corners: space.userData.drawCorners,
    })
    ctx.font = '16px sans-serif'
    ctx.textBaseline = 'top'
    ctx.fillStyle = options?.stroke ?? options?.fill ?? 'red'
    if (space.aspect !== null) {
      ctx.fillText(`A`, space.rect.x + 4, space.rect.y + 4)
    }

    ctx.globalAlpha = 1
  }

  const ctxRect = ({ x = 0, y = 0, width: w = 1, height: h = 1 }, {
    center = false,
    arrow = undefined as Direction | undefined,
    corners = false,
    diagonals = false,
    lateralHandles = false as boolean | number,
    sizeBars = false as boolean | number,
    quadrants = false as boolean | number,
    origin = undefined as 'top-left' | 'center' | undefined,
    stroke = undefined as string | undefined,
    lineWidth = undefined as number | undefined,
    fill = undefined as string | undefined,
    fitHorizontal = false,
    fitVertical = false,
  } = {}) => {
    if (origin === 'center') {
      ctx.fillStyle = stroke ?? fill ?? ''
      ctx.beginPath()
      ctx.arc(x + w / 2, y + h / 2, 3, 0, Math.PI * 2)
      ctx.fill()
    } else if (origin === 'top-left') {
      ctx.fillStyle = stroke ?? fill ?? ''
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    if (w > 0 || h > 0) {
      ctx.strokeStyle = stroke ?? ''
      ctx.lineWidth = lineWidth ?? 2
      ctx.fillStyle = fill ?? ''
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      if (fill)
        ctx.fill()
      if (stroke)
        ctx.stroke()

      if (arrow) {
        ctxRectDirectionArrow(arrow === Direction.Horizontal, { x, y, width: w, height: h })
        ctxRectFitMarkers({
          horizontal: fitHorizontal,
          vertical: fitVertical,
        }, { x, y, width: w, height: h })
      }
      if (center) {
        ctx.fillStyle = stroke ?? fill ?? ''
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      if (diagonals) {
        ctx.globalAlpha = 0.25
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + w, y + h)
        ctx.moveTo(x + w, y)
        ctx.lineTo(x, y + h)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      if (quadrants) {
        ctx.globalAlpha = quadrants === true ? 0.25 : quadrants
        ctx.beginPath()
        ctx.moveTo(x + w / 2, y)
        ctx.lineTo(x + w / 2, y + h)
        ctx.moveTo(x, y + h / 2)
        ctx.lineTo(x + w, y + h / 2)
        ctx.closePath()
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      if (corners) {
        const sz = 7
        ctx.beginPath()
        ctx.moveTo(x, y + sz)
        ctx.lineTo(x + sz, y + sz)
        ctx.lineTo(x + sz, y)
        ctx.moveTo(x + w - sz, y)
        ctx.lineTo(x + w - sz, y + sz)
        ctx.lineTo(x + w, y + sz)
        ctx.moveTo(x + w, y + h - sz)
        ctx.lineTo(x + w - sz, y + h - sz)
        ctx.lineTo(x + w - sz, y + h)
        ctx.moveTo(x + sz, y + h)
        ctx.lineTo(x + sz, y + h - sz)
        ctx.lineTo(x, y + h - sz)
        ctx.stroke()
      }
      if (sizeBars) {
        const mask = typeof sizeBars === 'boolean' ? 0b11 : sizeBars
        const m = 7
        const w2 = w / 2
        const h2 = h / 2
        if (mask & 0b01) {
          ctx.beginPath()
          ctx.moveTo(x + w2, y + m)
          ctx.lineTo(x + w2, y + h - m)
          ctx.stroke()
        }
        if (mask & 0b10) {
          ctx.beginPath()
          ctx.moveTo(x + m, y + h2)
          ctx.lineTo(x + w - m, y + h2)
          ctx.stroke()
        }
      }
      if (lateralHandles) {
        const mask = typeof lateralHandles === 'boolean' ? 0b1111 : lateralHandles
        const hw = w * .333
        const hw2 = hw / 2
        if (mask & 0b0001) {
          ctx.beginPath()
          ctx.moveTo(x + w / 2 - hw2, y + 5)
          ctx.lineTo(x + w / 2 + hw2, y + 5)
          ctx.stroke()
        }
        if (mask & 0b0010) {
          ctx.beginPath()
          ctx.moveTo(x + w - 5, y + h / 2 - hw2)
          ctx.lineTo(x + w - 5, y + h / 2 + hw2)
          ctx.stroke()
        }
        if (mask & 0b0100) {
          ctx.beginPath()
          ctx.moveTo(x + w / 2 - hw2, y + h - 5)
          ctx.lineTo(x + w / 2 + hw2, y + h - 5)
          ctx.stroke()
        }
        if (mask & 0b1000) {
          ctx.beginPath()
          ctx.moveTo(x + 5, y + h / 2 - hw2)
          ctx.lineTo(x + 5, y + h / 2 + hw2)
          ctx.stroke()
        }
      }
    }
    ctx.globalCompositeOperation = 'destination-over'
  }

  const ctxRectDirectionArrow = (horizontal: boolean, { x = 0, y = 0, width: w = 1, height: h = 1 }) => {
    const m = 7
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

  const ctxRectFitMarkers = ({ horizontal = true, vertical = true }, { x = 0, y = 0, width = 1, height = 1 }) => {
    const sz = 5
    const w = width
    const h = height
    const w2 = w / 2
    const h2 = h / 2
    if (horizontal) {
      ctx.beginPath()
      ctx.moveTo(x - sz, y + h2)
      ctx.lineTo(x, y + h2)
      ctx.moveTo(x + w, y + h2)
      ctx.lineTo(x + w + sz, y + h2)
      ctx.stroke()
    }
    if (vertical) {
      ctx.beginPath()
      ctx.moveTo(x + w2, y - sz)
      ctx.lineTo(x + w2, y)
      ctx.moveTo(x + w2, y + h)
      ctx.lineTo(x + w2, y + h + sz)
      ctx.stroke()
    }
  }

  return { canvas, ctx, ctxSpace, ctxClear, ctxRect }
}

export enum DrawMode {
  AllOutline = 1 << 0,
  FillLeaves = 1 << 1,
}

export function CanvasBlock({
  root: rootArg,
  size = [800, 600],
  name,
  title,
  description,
  drawMode = DrawMode.AllOutline,
  drawDirection,
  drawLeavesDiagonals,
  drawOrigin,
  computeLayout = (space: Space) => space.computeLayout(),
  colorRule = (space: Space) => colorValues[space.depth() % colorValues.length],
  onStart = undefined,
  tickDisabled = false,
  onTick: onTickArg = undefined,
}: {
  root: Space | Space[] | ((size: [number, number]) => Space | Space[])
  size?: Vector2Declaration | number[]
  name?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  drawMode?: DrawMode
  drawDirection?: boolean
  drawLeavesDiagonals?: boolean
  drawOrigin?: boolean
  computeLayout?: (space: Space) => void
  colorRule?: (space: Space) => ColorRepresentation
  onStart?: (roots: Space[]) => void
  tickDisabled?: boolean
  onTick?: (roots: Space[], tick: Tick) => void
}) {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const [width, height] = fromVector2Declaration(size)
    const handler = initFlexLayoutDemoCanvas(div, { width, height })

    const roots = (() => {
      let arg = rootArg
      if (typeof arg === 'function')
        arg = arg([width, height])
      return Array.isArray(arg) ? arg : [arg]
    })()

    const getColor = (space: Space) => {
      if (space.userData.color)
        return space.userData.color
      let current: Space | null = space
      while (current) {
        if (current.userData.color)
          return current.userData.color
        current = current.parent
      }
      return colorRule(space)
    }

    const draw = () => {
      handler.ctxClear()

      for (const root of roots) {
        computeLayout(root)

        switch (drawMode) {
          case DrawMode.FillLeaves: {
            for (const child of root.allLeaves()) {
              if (child.enabled === false)
                continue

              const color = getColor(child)
              handler.ctxSpace(child, { fill: color })
            }
          }
          default: {
            for (const child of root.allDescendants({ includeSelf: true })) {
              if (child.enabled === false)
                continue

              const color = getColor(child)
              const arrow = drawDirection ? child.direction : undefined
              handler.ctxSpace(child, {
                stroke: color,
                arrow,
                diagonals: drawLeavesDiagonals,
                origin: drawOrigin ? 'top-left' : undefined,
              })
            }
          }
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
      <div className='h-4' />
      <div className='text-xs opacity-70'>
        {name}
      </div>
      <div className='h-2' />
      <div className='flex flex-col items-center gap-2'>
        {title}
      </div>
      {description && (
        <div className='text-sm opacity-70 text-center'>
          {typeof description === 'string'
            ? (
              <ul className='w-[40em]'>
                {description.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </ul>
            )
            : description}
        </div>
      )}
    </div>
  )
}
