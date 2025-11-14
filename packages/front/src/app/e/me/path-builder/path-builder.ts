import { AngleDeclaration, fromAngleDeclaration, fromVector2Declaration, Vector2Declaration } from 'some-utils-ts/declaration'
import { cubicBezierArcControlPoints } from 'some-utils-ts/math/geom/bezier'
import { Line2 } from 'some-utils-ts/math/geom/line2'
import { Rectangle, RectangleDeclaration } from 'some-utils-ts/math/geom/rectangle'
import { Vector2Like } from 'some-utils-ts/types'
import { Args2, CommandFlags, commands, commandsByFlag, parseArgs2 } from './core'
import { Transform2DDeclaration, transform2DToMatrix3x2 } from './math'

/**
 * Note:
 * - SimplePath only use 'L', 'A', 'Q' & 'C' commands for drawing
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

  rect(params: RectangleDeclaration): this {
    const { x, y, width: w, height: h } = Rectangle.from(params)
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

  arc(params: {
    center: Vector2Declaration
    radius: Vector2Declaration
    startAngle: AngleDeclaration
    endAngle: AngleDeclaration
  }): this {
    const { x: cx, y: cy } = fromVector2Declaration(params.center)
    const { x: rx, y: ry } = fromVector2Declaration(params.radius)
    const startAngle = fromAngleDeclaration(params.startAngle)
    const endAngle = fromAngleDeclaration(params.endAngle)

    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0
    const sweepFlag = endAngle > startAngle ? 1 : 0

    const x = cx + rx * Math.cos(endAngle)
    const y = cy + ry * Math.sin(endAngle)

    this.commands.push(CommandFlags.A)
    this.args.push([rx, ry, (endAngle - startAngle) * 180 / Math.PI, largeArcFlag, sweepFlag, x, y])

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
    return commandsByFlag[command]
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
    const commandFlag = this.commands[index]
    const commandArgs = this.args[index]
    return commandsByFlag[commandFlag].extractPoint(commandArgs, out)
  }

  getPreviousPoint(startIndex: number): [index: number, point: { x: number, y: number }] {
    const max = this.commands.length
    for (let i = 1; i <= max; i++) {
      const index = this.loopIndex(startIndex - i)
      const point = this.getPointAt(index)
      if (point)
        return [index, point]
    }
    throw new Error(`No previous point found before command index ${startIndex}`)
  }

  getNextPoint(startIndex: number): [index: number, point: { x: number, y: number }] {
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
    const pathCommands: string[] = []

    {
      // Handle first command separately to convert it to 'M'
      switch (this.commands[0]) {
        case CommandFlags.L: {
          const [x, y] = this.args[0]
          pathCommands.push(commands.M.argsToString([x, y], precisionMax))
          break
        }
        case CommandFlags.A: {
          const [, pp] = this.getPreviousPoint(0)
          pathCommands.push(commands.M.argsToString([pp.x, pp.y], precisionMax))
          pathCommands.push(commands.A.argsToString(this.args[0], precisionMax))
          break
        }
        case CommandFlags.Q: {
          const [, pp] = this.getPreviousPoint(0)
          pathCommands.push(commands.M.argsToString([pp.x, pp.y], precisionMax))
          pathCommands.push(commands.Q.argsToString(this.args[0], precisionMax))
          break
        }
        case CommandFlags.C: {
          const [, pp] = this.getPreviousPoint(0)
          pathCommands.push(commands.M.argsToString([pp.x, pp.y], precisionMax))
          pathCommands.push(commands.C.argsToString(this.args[0], precisionMax))
          break
        }
      }
    }

    for (let i = 1; i < this.commands.length; i++) {
      const command = commandsByFlag[this.commands[i]]
      pathCommands.push(command.argsToString(this.args[i], precisionMax))
    }

    pathCommands.push('Z')

    return pathCommands.join(' ')
  }

  applyTransform(transform?: Transform2DDeclaration): this {
    const matrix = transform2DToMatrix3x2(transform)
    for (let i = 0; i < this.commands.length; i++) {
      const commandFlag = this.commands[i]
      const commandArgs = this.args[i]
      commandsByFlag[commandFlag].transformArgs(commandArgs, matrix)
    }
    return this
  }
}

export class SvgPathBuilder {

}
