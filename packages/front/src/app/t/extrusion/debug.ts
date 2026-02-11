import {
  CanvasTexture
} from 'three'

const defaultParams = {
  subdivisions: 8,
  size: 1024,
  lineSize: 2,
  lineColor: '#cccccc',
  checkerColorA: '#ffffff',
  checkerColorB: '#f3f3f3',
  textColor: '#0002',
}

type Params = typeof defaultParams

const cache = new Map<string, { canvas: HTMLCanvasElement; refCount: number }>()

function makeKey(p: Params) {
  // stable-ish key
  return [
    p.subdivisions,
    p.size,
    p.lineSize,
    p.lineColor,
    p.checkerColorA,
    p.checkerColorB,
    p.textColor,
  ].join('|')
}

function createCanvas(p: Params): HTMLCanvasElement {
  const { subdivisions, size, lineSize } = p
  const cell = size / subdivisions

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D context')

  // --- background checker (Y-up indexing)
  // canvas y grows downward, so map row(y-up) -> y-down
  for (let yUp = 0; yUp < subdivisions; yUp++) {
    const yDown = subdivisions - 1 - yUp
    for (let x = 0; x < subdivisions; x++) {
      const isA = (x + yUp) % 2 === 0
      ctx.fillStyle = isA ? p.checkerColorA : p.checkerColorB
      ctx.fillRect(x * cell, yDown * cell, cell, cell)
    }
  }

  // --- per-cell corner labels
  // small, subtle text; keep it readable on both checker colors
  const fontPx = Math.max(10, Math.floor(cell * .18))
  const pad = Math.max(4, Math.floor(cell * .08))

  ctx.font = `${fontPx * .8}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  ctx.textBaseline = 'top'
  ctx.fillStyle = p.textColor

  for (let yUp = 0; yUp < subdivisions; yUp++) {
    const yDown = subdivisions - 1 - yUp
    for (let x = 0; x < subdivisions; x++) {
      const x0 = x * cell
      const y0 = yDown * cell

      // Top-left corner (of the cell): corner coord = (x, yUp + 1) => write x component only
      const xText = String(x)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(xText, x0 + pad, y0 + pad)

      // Bottom-right corner (of the cell): corner coord = (x + 1, yUp) => write y component only
      const yText = String(yUp)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillText(yText, x0 + cell - pad, y0 + cell - pad)
    }
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${fontPx * 1.5}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  ctx.fillText('0,0', cell * .5, cell * (subdivisions - .5))
  ctx.fillText(`0,1`, cell * .5, cell * .5)
  ctx.fillText(`1,0`, cell * (subdivisions - .5), cell * (subdivisions - .5))
  ctx.fillText(`1,1`, cell * (subdivisions - .5), cell * .5)

  // --- grid lines (half visible on edges)
  ctx.strokeStyle = p.lineColor
  ctx.lineWidth = lineSize
  ctx.lineCap = 'butt'

  // Lines should be centered on boundaries; edges get clipped => half visible
  // To avoid .5px wobble, don’t snap; just draw at exact multiples.
  ctx.beginPath()
  for (let i = 0; i <= subdivisions; i++) {
    const x = i * cell
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)

    const y = i * cell
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
  }
  ctx.stroke()


  return canvas
}

function requireCanvas(key: string, params: Params): HTMLCanvasElement {
  const cached = cache.get(key)
  if (cached) {
    cached.refCount++
    return cached.canvas
  } else {
    const canvas = createCanvas(params)
    cache.set(key, { canvas, refCount: 1 })
    return canvas
  }
}

/**
 * UV debug texture (checker + grid lines + corner coords)
 *
 * - Y-up indexing: (0,0) is bottom-left cell, (subdiv-1, subdiv-1) is top-right cell
 * - Grid lines: centered on boundaries; outer lines are half visible (completed by repetition)
 * - Each cell has 2 small texts:
 *   - x coordinate (corner) in the top-left corner of the cell
 *   - y coordinate (corner) in the bottom-right corner of the cell
 */
class DebugTexture extends CanvasTexture {
  readonly key: string
  readonly params: Params

  constructor(userParams?: Partial<Params>) {
    const params = { ...defaultParams, ...userParams }

    const key = makeKey(params)

    const canvas = requireCanvas(key, params)

    super(canvas)

    this.key = key
    this.params = params
  }

  override dispose() {
    super.dispose()
    const entry = cache.get(this.key)
    if (!entry) {
      console.warn(`DebugTexture: dispose() called but no cache entry found for key ${this.key}`)
      return
    }
    entry.refCount--
    if (entry.refCount <= 0) {
      cache.delete(this.key)
    }
  }
}

export { DebugTexture }
export type { Params as DebugTextureParams }

