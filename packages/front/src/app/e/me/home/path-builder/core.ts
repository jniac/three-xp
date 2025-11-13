
export enum CommandFlags {
  M = 1 << 0, // MoveTo
  L = 1 << 1, // LineTo
  A = 1 << 2, // ArcTo
  Q = 1 << 3, // Quadratic Bezier To
  C = 1 << 4, // Cubic Bezier To
  Z = 1 << 5
}

class Command {
  flag: CommandFlags
  args: number
  code: string
  description: string
  argNames: string[]

  constructor(flag: CommandFlags, args: number, code: string, description: string, argNames: string) {
    this.flag = flag
    this.args = args
    this.code = code
    this.description = description
    this.argNames = argNames.split(/\s+/)
  }

  static #getPoint = { x: 0, y: 0 }

  /**
   * Extract the end point of this command given its arguments
   */
  extractPoint<T extends { x: number; y: number }>(args: number[], out?: T): T | null {
    out ??= Command.#getPoint as T
    switch (this.flag) {
      case CommandFlags.M:
      case CommandFlags.L:
        out.x = args[0]
        out.y = args[1]
        return out

      case CommandFlags.A:
        out.x = args[5]
        out.y = args[6]
        return out

      case CommandFlags.Q:
        out.x = args[2]
        out.y = args[3]
        return out

      case CommandFlags.C:
        out.x = args[4]
        out.y = args[5]
        return out

      case CommandFlags.Z:
        return null
    }
  }

  transformArgs(args: number[], matrix3x2: number[]) {
    const [a, b, c, d, e, f] = matrix3x2

    switch (this.flag) {
      case CommandFlags.M:
      case CommandFlags.L: {
        const x = args[0]
        const y = args[1]
        args[0] = a * x + c * y + e
        args[1] = b * x + d * y + f
        break
      }

      case CommandFlags.A: {
        const rx = args[0]
        const ry = args[1]
        // Note: This is a simplification that assumes uniform scaling
        // const avgScale = (Math.abs(a) + Math.abs(b) + Math.abs(c) + Math.abs(d)) / 2
        // args[0] = rx * avgScale
        // args[1] = ry * avgScale
        args[0] = a * rx + c * ry
        args[1] = b * rx + d * ry

        const x = args[5]
        const y = args[6]
        args[5] = a * x + c * y + e
        args[6] = b * x + d * y + f
        break
      }

      case CommandFlags.Q: {
        const ax = args[0]
        const ay = args[1]
        args[0] = a * ax + c * ay + e
        args[1] = b * ax + d * ay + f

        const x = args[2]
        const y = args[3]
        args[2] = a * x + c * y + e
        args[3] = b * x + d * y + f
        break
      }

      case CommandFlags.C: {
        const ax = args[0]
        const ay = args[1]
        args[0] = a * ax + c * ay + e
        args[1] = b * ax + d * ay + f

        const bx = args[2]
        const by = args[3]
        args[2] = a * bx + c * by + e
        args[3] = b * bx + d * by + f

        const x = args[4]
        const y = args[5]
        args[4] = a * x + c * y + e
        args[5] = b * x + d * y + f
        break
      }

      case CommandFlags.Z:
        break
    }
  }

  argsToString(args: number[], precisionMax = 2): string {
    const fmt = (v: number) => v.toFixed(precisionMax).replace(/\.?0+$/, '')
    const { code, flag } = this
    switch (flag) {
      case CommandFlags.M:
      case CommandFlags.L:
        return `${code} ${fmt(args[0])},${fmt(args[1])}`
      case CommandFlags.A:
        const [rx, ry, angle, largeArcFlag, sweepFlag, x, y] = args
        return `${code} ${fmt(rx)},${fmt(ry)} ${fmt(angle)} ${largeArcFlag} ${sweepFlag} ${fmt(x)},${fmt(y)}`
      case CommandFlags.Q: {
        const [ax, ay, x, y] = args
        return `${code} ${fmt(ax)},${fmt(ay)} ${fmt(x)},${fmt(y)}`
      }
      case CommandFlags.C: {
        const [ax, ay, bx, by, x, y] = args
        return `${code} ${fmt(ax)},${fmt(ay)} ${fmt(bx)},${fmt(by)} ${fmt(x)},${fmt(y)}`
      }
      case CommandFlags.Z:
        return code
    }
  }
}

export const commands = {
  M: new Command(CommandFlags.M, 2, 'M', 'Move To', 'x y'),
  L: new Command(CommandFlags.L, 2, 'L', 'Line To', 'x y'),
  A: new Command(CommandFlags.A, 7, 'A', 'Arc To', 'rx ry angle largeArcFlag sweepFlag x y'),
  Q: new Command(CommandFlags.Q, 4, 'Q', 'Quadratic Bezier To', 'ax ay x y'),
  C: new Command(CommandFlags.C, 6, 'C', 'Cubic Bezier To', 'ax ay bx by x y'),
  Z: new Command(CommandFlags.Z, 0, 'Z', 'Close Path', ''),
}

export const commandsByFlag = {
  [CommandFlags.M]: commands.M,
  [CommandFlags.L]: commands.L,
  [CommandFlags.A]: commands.A,
  [CommandFlags.Q]: commands.Q,
  [CommandFlags.C]: commands.C,
  [CommandFlags.Z]: commands.Z,
}

export type Args2 = [{ x: number; y: number }] | [number, number]

export function parseArgs2(args: Args2): [number, number] {
  if (typeof args[0] === 'object') {
    return [args[0].x, args[0].y]
  }
  return [(args as [number, number])[0], (args as [number, number])[1]]
}


