import { useState } from 'react'
import { Vector2 } from 'three'

import { Grid } from '@/components/react/Grid'
import { useGroup } from '@/tools/three-provider'
import { fromVector2Declaration } from 'some-utils-three/declaration'
import { DebugHelper, debugHelper } from 'some-utils-three/helpers/debug'
import { HashGrid2, hashX } from 'some-utils-ts/collection/spatial/hash-grid'
import { AStar } from 'some-utils-ts/experimental/astar'
import { generatePoissonDiscSamples2 } from 'some-utils-ts/experimental/poisson-disc-sampling'
import { lerp } from 'some-utils-ts/math/basic'
import { RandomUtils as Rnd } from 'some-utils-ts/random/random-utils'

const colors = [
  '#ffcc33',
  '#33ccff',
  '#cc66ff',
]

function Info({
  title = 'Info title',
  description = 'Info description',
}) {
  description = description
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '.125em',
      }}
    >
      <div>
        {title}
      </div>
      <div
        style={{
          fontSize: '.75em',
          color: '#fff9',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          maxHeight: '10em',
          paddingLeft: '2em',
        }}>
        {description}
      </div>
    </div>
  )
}

function RandomScene() {
  useGroup('random-scene', function* (group) {
    debugHelper
      .clear()
      .addTo(group)

    const grid = new HashGrid2<string>(.5)
    grid.set(.5, .3, '#ffcc00')
    grid.set(2.2, 3.1, '#00ffcc')
    grid.set(2.5, 3.5, '#00b7ff')

    Rnd
      .setRandom('parkmiller')
      .seed('reset')

    for (let i = 0; i < 300; i++) {
      const x = Rnd.number(-10, 10)
      const y = Rnd.number(-10, 10)
      const color = Rnd.pick(colors)
      grid.set(x, y, color)
    }

    const map = new Map<number, { x: number, y: number, count: number }>()
    for (const [x, y, color] of grid.entries()) {
      debugHelper.point([x, y], { color, size: 1, shape: 'plus-thin' })

      const h = hashX(x, y)
      const e = map.get(h)
      if (e === undefined) {
        map.set(h, { x: grid.floor(x), y: grid.floor(y), count: 1 })
      } else {
        e.count++
      }
    }

    // Draw "one-cell" entries
    for (const [x, y, color] of grid.cellEntries(3.5, -2.5)) {
      debugHelper
        .point([x, y], { color, size: 2, shape: 'ring-thin' })
    }

    // Draw "cell-neighbor" entries
    {
      const x = 5, y = 4
      debugHelper.box({
        center: [x + grid.cellSize * .5, y + grid.cellSize * .5],
        size: [grid.cellSize * 5, grid.cellSize * 5]
      })
      for (const [px, py, color] of grid.cellNeighborEntries(x, y, 2)) {
        debugHelper
          .point([px, py], { color, size: 2, shape: 'ring-thin' })
      }
    }

    for (const [, { x, y, count }] of map.entries()) {
      debugHelper
        // .text([x, y], `(${x},${y}) #${h}\n${count} items`, { color: 'white', size: .333 })
        .text([x + grid.cellSize / 2, y + grid.cellSize / 2], `(${x},${y})\n`, { color: 'white', size: .25 })
        .text([x + grid.cellSize / 2, y + grid.cellSize / 2], `\n${count}`, { color: 'white', size: .5 })
    }

    for (const [x, y, color] of grid.query(-5, -2, 4)) {
      debugHelper
        .point([x, y], { size: 1.5, shape: 'ring', color })
    }
    debugHelper
      .circle({ center: [-5, -2], radius: 4, quality: 'ultra' })

  }, [])

  return (
    <Info
      title='Hash-Grid 2D'
      description={`
        grid.cellEntries(x, y) - query all items in a cell
        grid.cellNeighborEntries(x, y, manhattanRadius) - query all items in a cell and its neighbors
        grid.query(x, y, radius) - query all items in a circle
      `}
    />
  )
}

function PoissonScene() {
  const [info, setInfo] = useState('')

  useGroup('poisson-scene', function* (group) {
    const logLines = [] as string[]

    const debugHelper = new DebugHelper({
      points: {
        pointCount: 1e5,
      }
    })
      .clear()
      .addTo(group)

    Rnd
      .setRandom('parkmiller')
      .seed('reset')

    const now = performance.now()
    const start = new Vector2(20.5, .15)
    const poisson = generatePoissonDiscSamples2({
      maxCount: 10000,
      isValid: (x, y) =>
        Math.hypot(x - 20, y - 0) < 20
        && Math.hypot(x - 10, y) > lerp(9.25, 9.5, Math.sin(40 * Math.atan2(y, x - 10)) * .5 + .5)
        && Math.hypot(x - (40 - 10), y) > lerp(9.25, 9.5, Math.sin(40 * Math.atan2(y, x - (40 - 10))) * .5 + .5),
      start: start,
      random: Rnd.random,
      radius: .1,
      radiusRatioMax: 1.4,
    })
    const elapsed = performance.now() - now
    logLines.push(`Poisson sampling took ${elapsed.toFixed(2)}ms (${poisson.samples.length} samples, radius: ${poisson.params.radius} to ${(poisson.params.radius * poisson.params.radiusRatioMax).toFixed(2)})`)

    debugHelper
      .circle({ center: start, radius: .1 })

    for (const p of poisson.samples)
      debugHelper
        .point(p, { size: .2, shape: 'circle', color: Rnd.pick(colors) })

    for (const [x, y] of poisson.grid.query(18, -8, 1))
      debugHelper
        .point([x, y], { size: .33, shape: 'ring', color: Rnd.pick(colors) })

    for (const [x, y] of poisson.grid.query(20, -10, poisson.params.radius * 1.5))
      debugHelper
        .point([x, y], { size: .33, shape: 'ring', color: Rnd.pick(colors) })

    {
      const [x, y] = poisson.grid.queryNearest(20, 10, .2)!
      debugHelper
        .point([x, y], { size: 1.5, shape: 'ring', color: 'white' })
    }

    {
      const now = performance.now()

      const start = fromVector2Declaration(poisson.grid.queryNearest(20, -10, .5)!)
      const goal = fromVector2Declaration(poisson.grid.queryNearest(20, 10, .5)!)
      const nodes = new Map<number, Vector2>()
      nodes.set(hashX(start.x, start.y), start)
      nodes.set(hashX(goal.x, goal.y), goal)
      function getNeighbors(node: Vector2) {
        const neighbors: Vector2[] = []
        for (const [x, y] of poisson.grid.query(node.x, node.y, poisson.params.radius * 1.5)) {
          const h = hashX(x, y)
          if (nodes.has(h)) {
            neighbors.push(nodes.get(h)!)
          } else {
            const node = new Vector2(x, y)
            nodes.set(h, node)
            neighbors.push(node)
          }
        }
        const result = neighbors.map(node => ({
          node,
          cost: node.distanceTo(node),
        }))
        return result
      }
      const astar = new AStar({
        start,
        goal,
        getNeighbors,
        heuristic: (a, b) => a.distanceTo(b),
      })
      const path = astar.findPath()
      debugHelper.polyline(path, { color: 'white', points: { size: .2, shape: 'x' } })

      const elapsed = performance.now() - now

      logLines.push(`A* pathfinding took ${elapsed.toFixed(2)}ms (path: ${path.length} nodes)`)

      setInfo(logLines.join('\n'))
    }
  }, [])
  return (
    <Info
      title='Poisson sampling + A* pathfinding'
      description={info}
    />
  )
}

export default function HashGridPage() {
  return (
    <>
      <Grid
        plane='xy'
        size={100}
        subdivisions={[10, 10, 2]}
        opacity={[.1, .01, .004]}
      />
      <div className='layer thru flex flex-col p-8 items-start'>
        <div className='p-8 flex flex-col gap-2 backdrop-blur-xl rounded border border-white/10'>
          <RandomScene />
          <PoissonScene />
        </div>
      </div>
    </>
  )
}
