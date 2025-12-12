import { useEffects } from 'some-utils-react/hooks/effects'

import { Space } from 'some-utils-ts/experimental/layout/flex'
import { colors } from './colors'

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
  const ctxRect = ({ x = 0, y = 0, width = 1, height = 1 }, {
    stroke = undefined as string | undefined,
    lineWidth = undefined as number | undefined,
    fill = undefined as string | undefined,
  } = {}) => {
    ctx.strokeStyle = stroke ?? ''
    ctx.lineWidth = lineWidth ?? 2
    ctx.fillStyle = fill ?? ''
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    if (fill)
      ctx.fill()
    if (stroke)
      ctx.stroke()
  }
  return { canvas, ctx, ctxRect }
}

export function CanvasBlock({
  root,
  description,
  computeLayout = (space: Space) => space.computeLayout(),
}: {
  root: Space
  description: React.ReactNode
  computeLayout?: (space: Space) => void
}) {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const { ctxRect } = initFlexLayoutDemoCanvas(div)

    computeLayout(root)

    const colorValues = Object.values(colors)
    for (const child of root.allDescendants({ includeSelf: true })) {
      const color = child.userData.color ?? colorValues[child.depth() % colorValues.length]
      ctxRect(child.rect, { stroke: color })
    }

  }, 'always')

  return (
    <div ref={ref} className='flex flex-col items-center gap-2 mt-8'>
      <canvas />
      <div className='mb-2 flex flex-col items-center gap-2'>
        {description}
      </div>
    </div>
  )
}
