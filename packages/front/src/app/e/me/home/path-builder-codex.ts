import { cubicBezierArcControlPoints } from 'some-utils-ts/math/geom/bezier'
import { Line2 } from 'some-utils-ts/math/geom/line2'
import { Vector2Like } from 'some-utils-ts/types'

enum Commands {
  M = 0, // MoveTo
  L = 1, // LineTo
  Q = 2, // Quadratic Bezier To
  C = 3, // Cubic Bezier To
  Z = 4, // Close
}

const commandsInfo = {
  [Commands.M]: { value: Commands.M, args: 2, code: 'M', description: 'Move To', },
  [Commands.L]: { value: Commands.L, args: 2, code: 'L', description: 'Line To', },
  [Commands.Q]: { value: Commands.Q, args: 4, code: 'Q', description: 'Quadratic Bezier To', },
  [Commands.C]: { value: Commands.C, args: 6, code: 'C', description: 'Cubic Bezier To', },
  [Commands.Z]: { value: Commands.Z, args: 0, code: 'Z', description: 'Close Path', },
}

type Args2 = [{ x: number, y: number }] | [number, number]
function parseArgs2(args: Args2): [number, number] {
  if (typeof args[0] === 'object') {
    return [args[0].x, args[0].y]
  }
  return [(args as [number, number])[0], (args as [number, number])[1]]
}

export class SimplePath {
  static instance = new SimplePath()

  commands: Commands[] = []
  args: number[][] = []
  closed = false

  clear(): this {
    this.commands = []
    this.args = []
    this.closed = false
    return this
  }

  moveTo(...args: Args2): this {
    if (this.closed)
      throw new Error('Cannot add new commands to a closed path')

    this.clear()

    this.commands.push(Commands.M)
    this.args.push(parseArgs2(args))
    return this
  }

  lineTo(...args: Args2): this {
    if (this.closed)
      throw new Error('Cannot add new commands to a closed path')

    this.commands.push(Commands.L)
    this.args.push(parseArgs2(args))
    return this
  }

  quadraticBezierTo(ax: number, ay: number, x: number, y: number): this {
    if (this.closed)
      throw new Error('Cannot add new commands to a closed path')

    this.commands.push(Commands.Q)
    this.args.push([ax, ay, x, y])
    return this
  }

  cubicBezierTo(ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number): this {
    if (this.closed)
      throw new Error('Cannot add new commands to a closed path')

    this.commands.push(Commands.C)
    this.args.push([ax1, ay1, ax2, ay2, x, y])
    return this
  }

  insertCubicBezierAt(index: number, ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number): this {
    if (index < 0)
      index += this.commands.length
    if (index < 0 || index > this.commands.length)
      throw new Error(`Command index out of range: ${index}`)

    this.commands.splice(index, 0, Commands.C)
    this.args.splice(index, 0, [ax1, ay1, ax2, ay2, x, y])
    return this
  }

  closePath(): this {
    if (this.closed)
      throw new Error('Cannot close a closed path!')

    this.commands.push(Commands.Z)
    this.args.push([])
    this.closed = true
    return this
  }

  getCommandInfo(index: number) {
    if (index < 0)
      index += this.commands.length
    if (index < 0 || index >= this.commands.length)
      throw new Error(`Command index out of range: ${index}`)
    const command = this.commands[index]
    return commandsInfo[command]
  }

  roundCorner(delegate: (info: { point: Vector2Like, angle: number, line1: Line2, line2: Line2 }) => { radius: number, tension?: number }) {
    const defaults = { radius: 0.1, tension: 1 }
    const point = { x: 0, y: 0 }
    const center = { x: 0, y: 0 }
    const controls = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
    const line1 = new Line2()
    const line2 = new Line2()
    const epsilon = 1e-6
    let cursorX = 0
    let cursorY = 0
    let subpathStartX = 0
    let subpathStartY = 0
    let prevLineIndex = -1
    let prevStartX = 0
    let prevStartY = 0
    let prevEndX = 0
    let prevEndY = 0
    let i = 0
    while (i < this.commands.length) {
      const command = this.commands[i]
      const args = this.args[i]
      switch (command) {
        case Commands.M: {
          cursorX = args[0]
          cursorY = args[1]
          subpathStartX = cursorX
          subpathStartY = cursorY
          prevLineIndex = -1
          i++
          break
        }
        case Commands.L: {
          const startX = cursorX
          const startY = cursorY
          const endX = args[0]
          const endY = args[1]

          if (prevLineIndex !== -1) {
            line1.fromStartEnd([prevStartX, prevStartY, prevEndX, prevEndY])
            line2.fromStartEnd([startX, startY, endX, endY])
            const angle = line1.angleTo(line2)
            const absAngle = Math.abs(angle)
            if (absAngle > epsilon) {
              const len1 = Math.hypot(prevEndX - prevStartX, prevEndY - prevStartY)
              const len2 = Math.hypot(endX - startX, endY - startY)
              if (len1 > epsilon && len2 > epsilon) {
                point.x = startX
                point.y = startY
                const { radius: radiusIn, tension: tensionIn } = {
                  ...defaults,
                  ...delegate({ point, angle, line1, line2 }),
                }
                let radius = Number.isFinite(radiusIn) ? radiusIn : defaults.radius
                let tension = defaults.tension
                if (Number.isFinite(tensionIn)) {
                  tension = tensionIn as number
                }
                if (radius > epsilon) {
                  const halfAngle = absAngle / 2
                  const tanHalfAngle = Math.tan(halfAngle)
                  if (Number.isFinite(tanHalfAngle) && Math.abs(tanHalfAngle) > epsilon) {
                    const maxRadius = Math.min(len1, len2) * tanHalfAngle
                    if (maxRadius > epsilon && radius > maxRadius) {
                      radius = maxRadius
                    }
                    if (radius > epsilon) {
                      const distance = radius / tanHalfAngle
                      if (Number.isFinite(distance) && distance > epsilon && distance < len1 && distance < len2) {
                        line1.offset(angle > 0 ? -radius : radius)
                        line2.offset(angle > 0 ? -radius : radius)
                        const intersection = line1.intersection(line2, { out: center })
                        if (intersection) {
                          let a1: number
                          let a2: number
                          if (angle > 0) {
                            a1 = line1.angle() - Math.PI / 2
                            a2 = line2.angle() - Math.PI / 2
                          } else {
                            a1 = line1.angle() + Math.PI / 2
                            a2 = line2.angle() + Math.PI / 2
                          }
                          if (Math.abs(a1 - a2) > Math.PI) {
                            if (a1 < a2) {
                              a1 += Math.PI * 2
                            } else {
                              a2 += Math.PI * 2
                            }
                          }
                          cubicBezierArcControlPoints(center, radius, a1, a2, tension, controls)
                          const startPoint = controls[0]
                          const endPoint = controls[3]
                          const prevArgs = this.args[prevLineIndex]
                          prevArgs[0] = startPoint.x
                          prevArgs[1] = startPoint.y
                          this.insertCubicBezierAt(i, controls[1].x, controls[1].y, controls[2].x, controls[2].y, endPoint.x, endPoint.y)
                          cursorX = endPoint.x
                          cursorY = endPoint.y
                          prevLineIndex = -1
                          i += 1
                          continue
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          cursorX = endX
          cursorY = endY
          prevLineIndex = i
          prevStartX = startX
          prevStartY = startY
          prevEndX = endX
          prevEndY = endY
          i++
          break
        }
        case Commands.C: {
          cursorX = args[4]
          cursorY = args[5]
          prevLineIndex = -1
          i++
          break
        }
        case Commands.Q: {
          cursorX = args[2]
          cursorY = args[3]
          prevLineIndex = -1
          i++
          break
        }
        case Commands.Z: {
          cursorX = subpathStartX
          cursorY = subpathStartY
          prevLineIndex = -1
          i++
          break
        }
        default: {
          i++
          break
        }
      }
    }
    return this
  }

  getPathData({ precisionMax = 2 } = {}): string {
    const fmt = (v: number) => v.toFixed(precisionMax).replace(/\.?0+$/, '')
    const fmtarr = (arr: number[]) => {
      const chunks: string[] = []
      for (let i = 0; i < arr.length; i += 2) {
        chunks.push(`${fmt(arr[i])} ${fmt(arr[i + 1])}`)
      }
      return chunks.join(',')
    }
    const commands = this.commands.map((command, i) => {
      const { code } = commandsInfo[command]
      return `${code}${fmtarr(this.args[i])}`
    })
    return commands.join(' ')
  }
}

export class SvgPathBuilder {

}
