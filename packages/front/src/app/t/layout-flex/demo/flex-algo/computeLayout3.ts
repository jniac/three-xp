import { ScalarType } from 'some-utils-ts/experimental/layout/flex/Scalar'
import { Space } from 'some-utils-ts/experimental/layout/flex/Space'
import { Direction } from 'some-utils-ts/experimental/layout/flex/types'

const PT = 0
const PR = 1
const PB = 2
const PL = 3

class Node {
  static nextId = 0
  static nextUid = 0

  uid = Node.nextUid++
  id = Node.nextId++

  /**
   * Whether this node is a horizontal layout node.
   */
  is_h: boolean

  /**
   * Position x
   */
  px = 0
  /**
   * Position y
   */
  py = 0

  /**
   * Size x
   */
  sx = 0
  /**
   * Size y
   */
  sy = 0

  /**
   * Padding right
   */
  pr = 0
  /**
   * Padding left
   */
  pl = 0
  /**
   * Padding top
   */
  pt = 0
  /**
   * Padding bottom
   */
  pb = 0

  gap = 0

  /**
   * Inner size x
   */
  inner_sx = 0
  /**
   * Inner size y
   */
  inner_sy = 0

  /**
   * Inner tangent free space
   */
  tgt_free = 0

  space: Space

  parent: Node | null = null
  children: Node[]

  p_is_h: boolean

  /**
   * Whether the space is "fractional" in the parent's tangent direction.
   */
  fractionalInTangent: boolean
  /**
   * Whether the space is "fractional" in the parent's normal direction.
   */
  fractionalInNormal: boolean

  sizeIsComputed = false

  constructor(space: Space, parent: Node | null = null) {
    this.space = space
    this.parent = parent
    this.p_is_h = parent?.is_h ?? true
    this.is_h = space.direction === Direction.Horizontal
    this.fractionalInTangent = this.p_is_h
      ? isFractional(space.sizeX.type, space.aspect)
      : isFractional(space.sizeY.type, space.aspect)
    this.fractionalInNormal = this.p_is_h
      ? isFractional(space.sizeY.type, space.aspect)
      : isFractional(space.sizeX.type, space.aspect)
    this.children = space.children.map(c => new Node(c, this))
  }

  /**
   * ⚠️ For debugging purposes only (treeString).
   */
  depth(): number {
    let d = 0
    let p = this.parent
    while (p !== null) {
      d++
      p = p.parent
    }
    return d
  }

  /**
   * ⚠️ For debugging purposes only (treeString).
   */
  isLastChild(): boolean {
    if (this.parent === null)
      return true
    const siblings = this.parent.children
    return siblings[siblings.length - 1] === this
  }

  /**
   * ⚠️ For debugging purposes only (treeString).
   * 
   * Yields all descendant INCLUDING self.
   */
  *allDescendants(): Generator<Node> {
    yield this
    for (const child of this.children) {
      yield* child.allDescendants()
    }
  }

  /**
   * ⚠️ For debugging purposes only (treeString()).
   * 
   * Yields all ancestor EXCLUDING self.
   */
  *allAncestors(): Generator<Node> {
    let current = this.parent
    while (current !== null) {
      yield current
      current = current.parent
    }
  }

  treeString(): string {
    return treeString(this)
  }
}

function treeString(root: Node): string {
  const lines = <string[]>[]
  let total = 0
  const f = (n: number) => n.toFixed(2).replace(/\.?0+$/, '')
  for (const s of root.allDescendants()) {
    const indent = s.allAncestors()
      .map(parentItem => {
        return parentItem.parent === null || parentItem.isLastChild() ? '   ' : '│  '
      })
      .toArray()
      .reverse()
      .join('')
    const relation = s.depth() === 0 ? '->' :
      s.isLastChild() === false ? '├─' : '└─'
    const childrenCount = s.children.length > 0 ? `(${s.children.length}) ` : ''
    const r = `r(${f(s.px)}, ${f(s.py)}, ${f(s.sx)}, ${f(s.sy)})`
    const free = `tgt_free(${f(s.tgt_free)})`
    const inner = `inner(${f(s.inner_sx)}, ${f(s.inner_sy)})`
    const line = `${indent}${relation} s${s.id} ${childrenCount}${r} ${free} ${inner}`
    lines.push(line)
    total++
  }
  lines.unshift(`Tree: (${total})`)
  const str = lines.join('\n')
  return str
}

function isFractional(scalarType: ScalarType, aspect: number | null) {
  return scalarType === ScalarType.Fraction
    || scalarType === ScalarType.Auto
  // || (scalarType === ScalarType.Auto && aspect === null) // Auto with no aspect is treated as fractional
}

function* iterateTangentFit(n: Node): Generator<Node> {
  for (const c of n.children) {
    yield* iterateTangentFit(c)
  }
  const tangentFit = n.is_h ? n.space.sizeXFitChildren : n.space.sizeYFitChildren
  if (tangentFit) {
    yield n
  }
}

function computeSpacings(n: Node) {
  n.pr = n.space.padding[PR].compute(n.sx, n.sy)
  n.pl = n.space.padding[PL].compute(n.sx, n.sy)
  n.pt = n.space.padding[PT].compute(n.sy, n.sx)
  n.pb = n.space.padding[PB].compute(n.sy, n.sx)
  n.inner_sx = n.sx - n.pl - n.pr
  n.inner_sy = n.sy - n.pt - n.pb
  n.gap = n.is_h
    ? n.space.gap.compute(n.sx, n.sy)
    : n.space.gap.compute(n.sy, n.sx)
}

function computeFitSizes(root: Node) {

}

function* regularChildren(n: Node): Generator<Node> {
  for (const c of n.children) {
    if (c.fractionalInTangent === false) {
      yield c
    }
  }
}

function* fractionalChildren(n: Node): Generator<Node> {
  for (const c of n.children) {
    if (c.fractionalInTangent === true) {
      yield c
    }
  }
}

/**
 * Compute the sizes of the children of the given root node.
 * 
 * - ⚠️ The given root node must have its size already computed.
 */
function computeChildrenSizes(root: Node) {
  const queue = [root]
  while (queue.length > 0) {
    const n = queue.shift()!
    computeSpacings(n)
    const isx = n.inner_sx
    const isy = n.inner_sy

    let tgt_free = n.is_h ? isx : isy
    if (n.is_h) {
      // REGULAR CHILDREN
      for (const c of regularChildren(n)) {
        c.sx = c.space.sizeX.compute(isx, isy)
        c.sy = c.space.sizeY.compute(isy, isx)
        tgt_free -= c.sx
      }
      tgt_free -= n.gap * Math.max(0, n.children.length - 1)

      // FRACTIONAL CHILDREN
      let total = 0
      for (const c of fractionalChildren(n)) {
        total += c.space.sizeX.value
      }
      const tgt_free_clmp = Math.max(0, tgt_free)
      for (const c of fractionalChildren(n)) {
        c.sx = tgt_free_clmp * (c.space.sizeX.value / total)
        c.sy = c.space.aspect !== null
          ? c.sx / c.space.aspect
          : c.space.sizeY.compute(isy, isx)
        tgt_free = 0 // Consumed all free spaces
      }
    } else {
      // REGULAR CHILDREN
      for (const c of regularChildren(n)) {
        c.sx = c.space.sizeX.compute(isx, isy)
        c.sy = c.space.sizeY.compute(isy, isx)
        tgt_free -= c.sy
      }
      tgt_free -= n.gap * Math.max(0, n.children.length - 1)

      // FRACTIONAL CHILDREN
      let total = 0
      for (const c of fractionalChildren(n)) {
        total += c.space.sizeY.value
      }
      const tgt_free_clmp = Math.max(0, tgt_free)
      for (const c of fractionalChildren(n)) {
        c.sy = tgt_free_clmp * (c.space.sizeY.value / total)
        c.sx = c.space.aspect !== null
          ? c.sy * c.space.aspect
          : c.space.sizeX.compute(isx, isy)
        tgt_free = 0 // Consumed all free spaces
      }
    }
    n.tgt_free = tgt_free

    queue.push(...n.children)
  }
}

function computeChildrenPositions(root: Node) {
  const queue = [root]
  while (queue.length > 0) {
    const n = queue.shift()!
    let x = n.px + n.pl
    let y = n.py + n.pt

    for (const c of n.children) {
      const ax = c.space.alignSelfX ?? n.space.alignChildrenX
      const ay = c.space.alignSelfY ?? n.space.alignChildrenX
      if (n.is_h) {
        c.px = x + n.tgt_free * ax
        c.py = y + (n.inner_sy - c.sy) * ay
        x += c.sx + n.gap
      } else {
        c.px = x + (n.inner_sx - c.sx) * ax
        c.py = y + n.tgt_free * ay
        y += c.sy + n.gap
      }

      queue.push(c)
    }
  }
}

function applyLayout(root: Node) {
  const queue = [root]
  while (queue.length > 0) {
    const n = queue.shift()!
    n.space.rect.set(n.px, n.py, n.sx, n.sy)
    queue.push(...n.children)
  }
}


export function computeLayout3(rootSpace: Space) {
  const root = new Node(rootSpace)

  root.px = rootSpace.offsetX.value
  root.py = rootSpace.offsetY.value
  root.sx = root.space.sizeX.compute(0, 0)
  root.sy = root.space.sizeY.compute(0, 0)
  computeSpacings(root)

  computeChildrenSizes(root)

  computeChildrenPositions(root)

  applyLayout(root)

  console.log(treeString(root))

  return root
}