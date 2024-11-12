import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Group, InstancedMesh, MeshBasicMaterial, PlaneGeometry } from 'three'

export enum CommandType {
  MoveTo = 'moveTo',
  LineTo = 'lineTo',
}

type Command = {
  type: CommandType
  x: number
  y: number
  z: number
  w: number
}

export class BigLines extends Group {
  thickness = .01

  parts = (() => {
    const geometry = new PlaneGeometry(1, 1)
    const material = new MeshBasicMaterial()
    const lines = setup(new InstancedMesh(geometry, material, 0), this)
    return { lines }
  })();

  clear(): this {
    const { lines } = this.parts
    lines.count = 0
    lines.instanceMatrix.array = new Float32Array(0)
    lines.instanceMatrix.needsUpdate = true
    return this
  }

  commands = <Command[]>[]

  moveTo(x: number, y: number): this
  moveTo(p: { x: number, y: number }): this
  moveTo(...args: any[]): this {
    const [x, y] = args.length === 1 ? [args[0].x, args[0].y] : args
    this.commands.push({ type: CommandType.MoveTo, x, y, z: 0, w: 1 })
    return this
  }

  lineTo(x: number, y: number): this
  lineTo(p: { x: number, y: number }): this
  lineTo(...args: any[]): this {
    const [x, y] = args.length === 1 ? [args[0].x, args[0].y] : args
    this.commands.push({ type: CommandType.LineTo, x, y, z: 0, w: 1 })
    return this
  }

  draw(): this {
    const { lines } = this.parts
    const { thickness, commands } = this
    const matrices = new Float32Array(commands.length * 16)
    let count = 0
    for (const [index, { type, x, y }] of commands.entries()) {
      if (type === CommandType.LineTo) {
        const previous = commands[index - 1]
        const vx = x - previous.x
        const vy = y - previous.y
        const cx = previous.x + vx / 2
        const cy = previous.y + vy / 2
        const length = Math.sqrt(vx * vx + vy * vy)
        const angle = Math.atan2(vy, vx)
        makeMatrix4({
          x: cx,
          y: cy,
          rotationZ: angle,
          scaleX: length,
          scaleY: thickness,
        }).toArray(matrices, count * 16)
        count++
      }
    }
    lines.count = count
    lines.instanceMatrix.array = matrices.slice(0, count * 16)
    lines.instanceMatrix.needsUpdate = true

    return this
  }
}
