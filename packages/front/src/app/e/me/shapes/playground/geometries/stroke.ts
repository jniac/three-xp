import { BufferAttribute, BufferGeometry, Curve, Vector3 } from 'three'

const shared = {
  vectorZ: new Vector3(0, 0, 1),

  point: new Vector3(),
  point2: new Vector3(),
  tangent: new Vector3(),
  normal: new Vector3(),
}

const defaultParams = {
  width: <number | [left: number, right: number]>1,
  steps: 100,
  roundCapSegments: 17,
}

type Params = typeof defaultParams

function updateStrokeGeometry(curve: Curve<Vector3>, params: Params, geometry: BufferGeometry) {
  const {
    width,
    steps,
    roundCapSegments,
  } = params

  const positions = geometry.attributes.position.array as Float32Array
  const uvs = geometry.attributes.uv.array as Float32Array

  const { vectorZ, point, point2, tangent, normal } = shared

  const [w_l, w_r] = Array.isArray(width) ? width : [width / 2, width / 2]
  const c_len = curve.getLength()

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    curve.getPoint(t, point)
    curve.getTangent(t, tangent)
    normal.crossVectors(tangent, vectorZ).normalize()

    // Left vertex
    positions[(i * 2) * 3 + 0] = point.x + normal.x * w_l
    positions[(i * 2) * 3 + 1] = point.y + normal.y * w_l
    positions[(i * 2) * 3 + 2] = point.z + normal.z * w_l
    uvs[(i * 2) * 2 + 0] = t
    uvs[(i * 2) * 2 + 1] = 0

    // Right vertex
    positions[(i * 2 + 1) * 3 + 0] = point.x - normal.x * w_r
    positions[(i * 2 + 1) * 3 + 1] = point.y - normal.y * w_r
    positions[(i * 2 + 1) * 3 + 2] = point.z - normal.z * w_r
    uvs[(i * 2 + 1) * 2 + 0] = t
    uvs[(i * 2 + 1) * 2 + 1] = 1
  }

  // Start cap
  curve.getPoint(0, point)
  curve.getTangent(0, tangent)
  normal.crossVectors(tangent, shared.vectorZ).normalize()
  point.addScaledVector(normal, (w_l - w_r) / 2) // Center the cap

  const r = (w_l + w_r) / 2
  const off_s = (steps + 1) * 2
  for (let i = 0; i < roundCapSegments; i++) {
    const a = (i + 1) / (roundCapSegments + 1) * Math.PI
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    point2.copy(point)
      .addScaledVector(normal, cos * r)
      .addScaledVector(tangent, -sin * r)
    positions[off_s * 3 + i * 3 + 0] = point2.x
    positions[off_s * 3 + i * 3 + 1] = point2.y
    positions[off_s * 3 + i * 3 + 2] = point2.z
    uvs[off_s * 2 + i * 2 + 0] = -sin * r / c_len
    uvs[off_s * 2 + i * 2 + 1] = 0.5 + -cos * 0.5
  }

  // End cap
  curve.getPoint(1, point)
  curve.getTangent(1, tangent)
  normal.crossVectors(tangent, shared.vectorZ).normalize()
  point.addScaledVector(normal, (w_l - w_r) / 2) // Center the cap

  const off_e = off_s + roundCapSegments
  for (let i = 0; i < roundCapSegments; i++) {
    const a = (i + 1) / (roundCapSegments + 1) * Math.PI
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    point2.copy(point)
      .addScaledVector(normal, cos * r)
      .addScaledVector(tangent, sin * r)
    positions[off_e * 3 + i * 3 + 0] = point2.x
    positions[off_e * 3 + i * 3 + 1] = point2.y
    positions[off_e * 3 + i * 3 + 2] = point2.z
    uvs[off_e * 2 + i * 2 + 0] = 1 + sin * r / c_len
    uvs[off_e * 2 + i * 2 + 1] = 0.5 + -cos * 0.5
  }

  geometry.attributes.position.needsUpdate = true
  geometry.attributes.uv.needsUpdate = true

  geometry.computeVertexNormals()
}

export class StrokeGeometry extends BufferGeometry {
  params: typeof defaultParams
  curve: Curve<Vector3>

  state = {
    ribbon: {
      start: 0,
      count: 0,
    },
    capStart: {
      start: 0,
      count: 0,
    },
    capEnd: {
      start: 0,
      count: 0,
    },
    total: {
      count: 0,
    },
  }

  constructor(curve: Curve<Vector3>, userParams: Partial<typeof defaultParams>) {
    super()
    this.params = { ...defaultParams, ...userParams }
    this.curve = curve

    const { steps, roundCapSegments } = this.params

    this.state.ribbon.count = (steps + 1) * 2
    this.state.capStart.start = this.state.ribbon.count
    this.state.capStart.count = roundCapSegments * 2
    this.state.capEnd.start = this.state.capStart.start + this.state.capStart.count
    this.state.capEnd.count = roundCapSegments * 2
    this.state.total.count = this.state.ribbon.count + this.state.capStart.count + this.state.capEnd.count

    const { count: totalCount } = this.state.total
    const positions = new Float32Array(totalCount * 3)
    const uvs = new Float32Array(totalCount * 2)

    const indices = []
    for (let i = 0; i < steps; i++) {
      const indexOffset = i * 2
      indices.push(
        indexOffset, indexOffset + 2, indexOffset + 1,
        indexOffset + 1, indexOffset + 2, indexOffset + 3
      )
    }

    const off_s = (steps + 1) * 2
    const off_e = off_s + roundCapSegments

    // Start cap
    indices.push(0, 1, off_s)
    indices.push(1, off_s + roundCapSegments - 1, off_s)
    // End cap
    indices.push(steps * 2, off_e, steps * 2 + 1)
    indices.push(steps * 2 + 1, off_e, off_e + roundCapSegments - 1)

    const max_s = Math.floor(roundCapSegments / 2 - 1)
    for (let i = 0; i < max_s; i++) {
      // Start cap
      indices.push(
        off_s + i + 1,
        off_s + i,
        off_s + roundCapSegments - 1 - i)
      indices.push(
        off_s + i + 1,
        off_s + roundCapSegments - 1 - i,
        off_s + roundCapSegments - 2 - i)
      // End cap
      indices.push(
        off_e + i,
        off_e + i + 1,
        off_e + roundCapSegments - 1 - i)
      indices.push(
        off_e + i + 1,
        off_e + roundCapSegments - 2 - i,
        off_e + roundCapSegments - 1 - i)
    }

    if (roundCapSegments % 2 === 1) {
      indices.push(
        off_s + max_s + 1,
        off_s + max_s,
        off_s + max_s + 2)
      indices.push(
        off_e + max_s,
        off_e + max_s + 1,
        off_e + max_s + 2)
    }

    this.setIndex(indices)
    this.setAttribute('position', new BufferAttribute(positions, 3))
    this.setAttribute('uv', new BufferAttribute(uvs, 2))

    this.update()
  }

  update(): this {
    updateStrokeGeometry(this.curve, this.params, this)
    return this
  }
}
