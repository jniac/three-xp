import { fromVector2Declaration, fromVector3Declaration, Vector2Declaration, Vector3Declaration } from 'some-utils-ts/declaration'
import { applyMatrix3x2ToPoint, Transform2DDeclaration, transform2DToMatrix3x2 } from '../home/path-builder/math'
import { SimplePath } from '../home/path-builder/path-builder'

const defaultCrossWheelParams = {
  size: 1,
  thickness: .8 / 3,
  aperture: (1 / 2) / 3,
  depth: 2 / 5,
}

class CrossWheelBuilder {
  params: typeof defaultCrossWheelParams

  transform: Transform2DDeclaration = {
    scale: 200,
    // rotation: '30deg',
  }

  constructor(params?: Partial<typeof defaultCrossWheelParams>) {
    this.params = { ...defaultCrossWheelParams, ...params }
  }

  getPathData() {
    const s = this.params.size
    const t = this.params.thickness
    const a = this.params.aperture
    const d = this.params.depth - a / 2
    const r1 = (s - t) / 2

    SimplePath.instance
      .clear()
      .moveTo(-s / 2, -t / 2)

      // top left arc
      .arc({
        center: [-s / 2, -s / 2],
        radius: r1,
        startAngle: '90deg',
        endAngle: '0deg',
      })

      // top aperture
      .lineTo(-a / 2, -s / 2)
      .lineTo(-a / 2, -(s / 2 - d))
      .arc({
        center: [0, -(s / 2 - d)],
        radius: a / 2,
        startAngle: '180deg',
        endAngle: '0deg',
      })
      .lineTo(a / 2, -s / 2)
      .lineTo(t / 2, -s / 2)

      // top right arc
      .arc({
        center: [s / 2, -s / 2],
        radius: r1,
        startAngle: '180deg',
        endAngle: '90deg',
      })

      // right aperture
      .lineTo(s / 2, -a / 2)
      .lineTo(s / 2 - d, -a / 2)
      .arc({
        center: [s / 2 - d, 0],
        radius: a / 2,
        startAngle: '270deg',
        endAngle: '90deg',
      })
      .lineTo(s / 2, a / 2)
      .lineTo(s / 2, t / 2)

      // bottom right arc
      .arc({
        center: [s / 2, s / 2],
        radius: r1,
        startAngle: '270deg',
        endAngle: '180deg',
      })

      // bottom aperture
      .lineTo(a / 2, s / 2)
      .lineTo(a / 2, s / 2 - d)
      .arc({
        center: [0, s / 2 - d],
        radius: a / 2,
        startAngle: '0deg',
        endAngle: '-180deg',
      })
      .lineTo(-a / 2, s / 2)
      .lineTo(-t / 2, s / 2)

      // bottom left arc
      .arc({
        center: [-s / 2, s / 2],
        radius: r1,
        startAngle: '0deg',
        endAngle: '-90deg',
      })

      // left aperture
      .lineTo(-s / 2, a / 2)
      .lineTo(-s / 2 + d, a / 2)
      .arc({
        center: [-s / 2 + d, 0],
        radius: a / 2,
        startAngle: '90deg',
        endAngle: '-90deg',
      })
      .lineTo(-s / 2, -a / 2)
      .closePath()

    return SimplePath.instance
      .applyTransform(this.transform)
      .getPathData()
  }

  getSvgHelpers({
    color = 'red',
  } = {}): string {
    const matrix = transform2DToMatrix3x2(this.transform)
    const averageScale = (Math.hypot(matrix[0], matrix[1]) + Math.hypot(matrix[2], matrix[3])) / 2

    const dot = (...args: [Vector2Declaration] | [number, number]) => {
      const { x, y } = fromVector2Declaration(args.length === 2 ? args : args[0])
      const { x: cx, y: cy } = applyMatrix3x2ToPoint(matrix, { x, y })
      return `<circle cx="${cx}" cy="${cy}" r="2" fill="${color}" />`
    }

    const circle = (...args: [Vector3Declaration] | [number, number, number?]) => {
      const { x, y, z: r } = fromVector3Declaration((args.length > 1 ? args : args[0]) as Vector3Declaration)
      const { x: cx, y: cy } = applyMatrix3x2ToPoint(matrix, { x, y })
      return `<circle cx="${cx}" cy="${cy}" r="${r || 4}" stroke="${color}" fill="none" />`
    }

    const dashedCircle = (...args: [Vector3Declaration] | [number, number, number?]) => {
      const { x, y, z: r } = fromVector3Declaration((args.length > 1 ? args : args[0]) as Vector3Declaration)
      const { x: cx, y: cy } = applyMatrix3x2ToPoint(matrix, { x, y })
      return `<circle cx="${cx}" cy="${cy}" r="${r || 4}" stroke="${color}" fill="none" stroke-dasharray="4 4" />`
    }

    const plus = (...args: [Vector2Declaration] | [number, number]) => {
      const { x, y } = fromVector2Declaration(args.length === 2 ? args : args[0])
      const { x: cx, y: cy } = applyMatrix3x2ToPoint(matrix, { x, y })
      return `<line x1="${cx - 4}" y1="${cy}" x2="${cx + 4}" y2="${cy}" stroke="${color}" stroke-width="1" />
              <line x1="${cx}" y1="${cy - 4}" x2="${cx}" y2="${cy + 4}" stroke="${color}" stroke-width="1" />`
    }

    const s = this.params.size
    const t = this.params.thickness
    const a = this.params.aperture

    return [
      dot(0, 0),

      plus(-s / 2, -s / 2),
      plus(s / 2, -s / 2),
      plus(s / 2, s / 2),
      plus(-s / 2, s / 2),

      dashedCircle(-s / 2, -s / 2, s / 2 * averageScale),
      dashedCircle(s / 2, -s / 2, s / 2 * averageScale),
      dashedCircle(s / 2, s / 2, s / 2 * averageScale),
      dashedCircle(-s / 2, s / 2, s / 2 * averageScale),

      // left:
      circle(-s / 2, -t / 2),
      dot(-s / 2, -t / 2),
      dot(-s / 2, -a / 2),
      dot(-s / 2, a / 2),
      dot(-s / 2, t / 2),

      // top:
      dot(-t / 2, -s / 2),
      dot(-a / 2, -s / 2),
      dot(a / 2, -s / 2),
      dot(t / 2, -s / 2),

      // right:
      dot(s / 2, -t / 2),
      dot(s / 2, -a / 2),
      dot(s / 2, a / 2),
      dot(s / 2, t / 2),

      // bottom:
      dot(t / 2, s / 2),
      dot(a / 2, s / 2),
      dot(-a / 2, s / 2),
      dot(-t / 2, s / 2),
    ].join('\n')
  }
}

export function ShapesPage() {
  const crossWheel = new CrossWheelBuilder()
  return (
    <div className='page bg-[#3a3737] flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>
        Shapes Page
      </h1>

      <svg
        width='400'
        height='400'
        viewBox='-200 -200 400 400'
        style={{ border: '1px solid black' }}
      >
        <g dangerouslySetInnerHTML={{ __html: crossWheel.getSvgHelpers() }} />
        <path
          fill='#ffffff'
          d={crossWheel.getPathData()}
        />
      </svg>
    </div>
  )
}