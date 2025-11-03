import { cubicBezierArcControlPoints } from 'some-utils-ts/math/geom/bezier'
import { Line2 } from 'some-utils-ts/math/geom/line2'
import { Vector2Like } from 'some-utils-ts/types'

enum CommandFlags {
  M = 1 << 0, // MoveTo
  L = 1 << 1, // LineTo
  Q = 1 << 2, // Quadratic Bezier To
  C = 1 << 3, // Cubic Bezier To
  Z = 1 << 4, // Close
}

const commandsInfo = {
  [CommandFlags.M]: { flag: CommandFlags.M, args: 2, code: 'M', description: 'Move To', },
  [CommandFlags.L]: { flag: CommandFlags.L, args: 2, code: 'L', description: 'Line To', },
  [CommandFlags.Q]: { flag: CommandFlags.Q, args: 4, code: 'Q', description: 'Quadratic Bezier To', },
  [CommandFlags.C]: { flag: CommandFlags.C, args: 6, code: 'C', description: 'Cubic Bezier To', },
  [CommandFlags.Z]: { flag: CommandFlags.Z, args: 0, code: 'Z', description: 'Close Path', },
}

type Args2 = [{ x: number, y: number }] | [number, number]
function parseArgs2(args: Args2): [number, number] {
  if (typeof args[0] === 'object') {
    return [args[0].x, args[0].y]
  }
  return [(args as [number, number])[0], (args as [number, number])[1]]
}

/**
 * Note:
 * - SimplePath only use 'L', 'Q' & 'C' commands for drawing
 */
export class SimplePath {
  static instance = new SimplePath()

  commands: CommandFlags[] = []
  args: number[][] = []
  closed = false

  clear(): this {
    this.commands = []
    this.args = []
    this.closed = false
    return this
  }

  moveTo(...args: Args2): this {
    this.clear()

    this.commands.push(CommandFlags.L)
    this.args.push(parseArgs2(args))
    return this
  }

  insertLineAt(index: number, ...args: Args2): this {
    if (index < 0)
      index += this.commands.length
    if (index < 0 || index > this.commands.length)
      throw new Error(`Command index out of range: ${index}`)

    this.commands.splice(index, 0, CommandFlags.L)
    this.args.splice(index, 0, parseArgs2(args))
    return this
  }

  lineTo(...args: Args2): this {
    this.commands.push(CommandFlags.L)
    this.args.push(parseArgs2(args))
    return this
  }

  rect(params: { x: number, y: number, width: number, height: number }): this {
    const { x, y, width: w, height: h } = params
    this.commands.push(CommandFlags.L)
    this.commands.push(CommandFlags.L)
    this.commands.push(CommandFlags.L)
    this.commands.push(CommandFlags.L)
    this.args.push([x, y])
    this.args.push([x + w, y])
    this.args.push([x + w, y + h])
    this.args.push([x, y + h])
    return this
  }

  quadraticBezierTo(ax: number, ay: number, x: number, y: number): this {
    this.commands.push(CommandFlags.Q)
    this.args.push([ax, ay, x, y])
    return this
  }

  cubicBezierTo(ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number): this {
    this.commands.push(CommandFlags.C)
    this.args.push([ax1, ay1, ax2, ay2, x, y])
    return this
  }

  insertCubicBezierAt(index: number, ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number): this {
    if (index < 0)
      index += this.commands.length
    if (index < 0 || index > this.commands.length)
      throw new Error(`Command index out of range: ${index}`)

    this.commands.splice(index, 0, CommandFlags.C)
    this.args.splice(index, 0, [ax1, ay1, ax2, ay2, x, y])
    return this
  }

  closePath(): this {
    this.closed = true
    return this
  }

  loopIndex(index: number): number {
    if (index < 0)
      index += this.commands.length
    if (index >= this.commands.length)
      index -= this.commands.length
    if (index < 0 || index >= this.commands.length)
      throw new Error(`Command index out of range: ${index}`)
    return index
  }

  getCommandInfo(index: number) {
    index = this.loopIndex(index)
    const command = this.commands[index]
    return commandsInfo[command]
  }

  setArgsAt(index: number, args: number[]): this {
    index = this.loopIndex(index)
    const commandInfo = this.getCommandInfo(index)
    if (args.length !== commandInfo.args)
      throw new Error(`Invalid number of arguments for command ${commandInfo.code}: expected ${commandInfo.args}, got ${args.length}`)
    this.args[index] = args
    return this
  }

  getPointAt<T extends Vector2Like>(index: number, out?: T): T | null {
    out ??= { x: 0, y: 0 } as T
    index = this.loopIndex(index)
    const command = this.commands[index]
    const args = this.args[index]
    switch (command) {
      case CommandFlags.M:
      case CommandFlags.L: {
        out.x = args[0]
        out.y = args[1]
        return out
      }
      case CommandFlags.C: {
        out.x = args[4]
        out.y = args[5]
        return out
      }
      case CommandFlags.Q: {
        out.x = args[2]
        out.y = args[3]
        return out
      }
      default: {
        return null
      }
    }
  }

  getPreviousPoint(startIndex: number): [number, { x: number, y: number }] {
    const max = this.commands.length
    for (let i = 1; i <= max; i++) {
      const index = this.loopIndex(startIndex - i)
      const point = this.getPointAt(index)
      if (point)
        return [index, point]
    }
    throw new Error(`No previous point found before command index ${startIndex}`)
  }

  getNextPoint(startIndex: number): [number, { x: number, y: number }] {
    const max = this.commands.length
    for (let i = 1; i <= max; i++) {
      const index = this.loopIndex(startIndex + i)
      const point = this.getPointAt(index)
      if (point)
        return [index, point]
    }
    throw new Error(`No next point found after command index ${startIndex}`)
  }


  roundCorner(delegate: (info: { pointIndex: number, point: Vector2Like, angle: number, line1: Line2, line2: Line2 }) => { radius: number, tension?: number }): this {
    const point = { x: 0, y: 0 }
    const controlPoints = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    const line1 = new Line2()
    const line2 = new Line2()
    const delegateInfo = { pointIndex: 0, point, angle: 0, line1, line2 }

    let iterationIndex = 0
    for (let i = 0; i < this.commands.length; i++) {
      // p: previous point
      // c: current point
      // n: next point

      const cp = this.getPointAt(i, point)

      if (!cp)
        continue

      const [pi, pp] = this.getPreviousPoint(i)
      const [ni, np] = this.getNextPoint(i)

      line1.fromStartEnd(pp.x, pp.y, cp.x, cp.y)
      line2.fromStartEnd(cp.x, cp.y, np.x, np.y)
      const angle = line1.angleTo(line2)
      if (Math.abs(angle) < 1e-6) {
        // No corner to round
        iterationIndex += 1
        continue
      }

      delegateInfo.pointIndex = iterationIndex // Use iterationIndex to reflect the inserted commands before any new insertions
      delegateInfo.angle = angle
      const { radius, tension = 1 } = delegate(delegateInfo)

      const offset = angle > 0 ? -radius : radius
      line1.offset(offset)
      line2.offset(offset)

      line1.intersection(line2, { out: point })

      let a1, a2
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

      // Compute control points for the cubic Bezier curve
      cubicBezierArcControlPoints(point, radius, a1, a2, tension, controlPoints)

      this.setArgsAt(i, [controlPoints[0].x, controlPoints[0].y])
      this.insertCubicBezierAt(ni,
        controlPoints[1].x, controlPoints[1].y,
        controlPoints[2].x, controlPoints[2].y,
        controlPoints[3].x, controlPoints[3].y)

      i += 1 // Skip the inserted command
      iterationIndex += 1
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
    const commands: string[] = []

    {
      // Handle first command separately to convert it to 'M'
      switch (this.commands[0]) {
        case CommandFlags.L: {
          const [x, y] = this.args[0]
          commands.push(`M${fmt(x)} ${fmt(y)}`)
          break
        }
        case CommandFlags.Q: {
          const [, pp] = this.getPreviousPoint(0)
          const [ax, ay, x, y] = this.args[0]
          commands.push(`M${fmt(pp.x)} ${fmt(pp.y)}`)
          commands.push(`Q${fmt(ax)} ${fmt(ay)},${fmt(x)} ${fmt(y)}`)
          break
        }
        case CommandFlags.C: {
          const [, pp] = this.getPreviousPoint(0)
          const [ax1, ay1, ax2, ay2, x, y] = this.args[0]
          commands.push(`M${fmt(pp.x)} ${fmt(pp.y)}`)
          commands.push(`C${fmt(ax1)} ${fmt(ay1)},${fmt(ax2)} ${fmt(ay2)},${fmt(x)} ${fmt(y)}`)
          break
        }
      }
    }

    for (let i = 1; i < this.commands.length; i++) {
      const { code } = commandsInfo[this.commands[i]]
      commands.push(`${code}${fmtarr(this.args[i])}`)
    }

    commands.push('Z')

    return commands.join(' ')
  }
}

export class SvgPathBuilder {

}
