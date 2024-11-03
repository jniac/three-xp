import { Space } from 'some-utils-ts/experimental/layout/flex'
import { Positioning } from 'some-utils-ts/experimental/layout/flex/types'

function getColor(space: Space | null) {
  let color: string | undefined = undefined
  while (!color && space) {
    color = space.userData.color
    if (color !== undefined) {
      return color
    }
    space = space.parent
  }
  return '#ffffff'
}

export class CanvasContext {
  ctx: CanvasRenderingContext2D
  pixelRatio: number
  width: number
  height: number
  constructor(canvas: HTMLCanvasElement, {
    pixelRatio = window.devicePixelRatio,
    width = 800,
    height = 600,
  } = {}) {
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    this.ctx = canvas.getContext('2d')!
    this.pixelRatio = pixelRatio
    this.width = width
    this.height = height
  }
  paint(root: Space) {
    const { ctx, pixelRatio } = this
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    root.computeLayout()
    const computeZIndex = (space: Space) => {
      let score = 0
      for (const parent of space.allAncestors({ includeSelf: true })) {
        score += parent.positioning === Positioning.Detached ? 100 : 1
      }
      return score
    }
    const spaces = [...root.allDescendants({ includeSelf: false })]
      .filter(space => !space.userData.skipPaint)
      .sort((a, b) => computeZIndex(a) - computeZIndex(b))
    for (const space of spaces) {
      const rect = space.rect.clone().multiplyScalar(pixelRatio)
      const color = getColor(space)
      if (space.userData.plain) {
        ctx.strokeStyle = ''
        ctx.fillStyle = color
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
      } else {
        ctx.lineWidth = 2 * pixelRatio
        ctx.strokeStyle = color
        ctx.fillStyle = 'rgba(0, 0, 0, .5)'
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      }
    }
  }
}
