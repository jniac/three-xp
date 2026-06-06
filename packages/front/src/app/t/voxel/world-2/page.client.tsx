'use client'

import { createNoise3D } from 'simplex-noise'
import { BufferGeometry, DirectionalLight, Group, HemisphereLight, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, PCFShadowMap, Raycaster, TorusGeometry, Vector3 } from 'three'
import { GTAOPass } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { rayMeshAllIntersectionsCount } from 'some-utils-three/experimental/geometry/intersection/intersection-mesh'
import { createNaiveVoxelGeometry, World } from 'some-utils-three/experimental/voxel'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { TransformTool } from 'some-utils-three/objects/tools'
import { setup } from 'some-utils-three/utils/tree'
import { loop3 } from 'some-utils-ts/iteration/loop'
import { Message } from 'some-utils-ts/message'
import { wait } from 'some-utils-ts/misc/async'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

class TestMesh extends Mesh {
  static test_private = {
    raycaster: new Raycaster(),
    R: new Vector3(1, 0, 0),
    L: new Vector3(-1, 0, 0),
  }
  static material = new MeshBasicMaterial({ wireframe: true })
  constructor(geometry: BufferGeometry) {
    super(geometry, TestMesh.material)
    this.castShadow = false
    this.receiveShadow = false
  }
}

class ProjectedTorus extends TestMesh {
  constructor({
    radius = 18,
    tube = 5
  } = {}) {
    super(new TorusGeometry(radius, tube, 8, 32))
    this.rotation.set(1, 1, 0)
    this.updateMatrixWorld()
  }

  test(p: Vector3): boolean {
    const { raycaster, R } = TestMesh.test_private
    raycaster.set(p, R)
    const intersects = raycaster.intersectObject(this)
    return intersects.length % 2 === 1
  }
}

function flipNormal(geometry: BufferGeometry): BufferGeometry {
  const index = geometry.index!
  for (let i = 0; i < index.count; i += 3) {
    const tmp = index.getX(i)
    index.setX(i, index.getX(i + 2))
    index.setX(i + 2, tmp)
  }
  return geometry
}

class Torus extends TestMesh {
  constructor({
    radius = 18,
    tube = 5
  } = {}) {
    const geometry = flipNormal(new TorusGeometry(radius, tube, 8, 32))
    super(geometry)
  }

  lr(p: Vector3): [number, number] {
    const { R, L } = TestMesh.test_private
    return [
      rayMeshAllIntersectionsCount(p, R, this),
      rayMeshAllIntersectionsCount(p, L, this)
    ]
  }

  test(p: Vector3): boolean {
    const { R, L } = TestMesh.test_private
    if (rayMeshAllIntersectionsCount(p, R, this) % 2 === 1) {
      return rayMeshAllIntersectionsCount(p, L, this) % 2 === 1
    }
    return false
  }
}

class WorldHandler {
  world = new World()

  torus1 = setup(new Torus({ radius: 25, tube: 8 }), {
    rotation: [1, 1, 0],
  }, torus => {
    torus.updateMatrixWorld()
  })

  torus2 = setup(new Torus({ radius: 35, tube: 15 }), {
    position: [-20, -20, 0],
    rotation: '90deg, 0, 0',
  }, torus => {
    torus.updateMatrixWorld()
  });

  *generate(): IterableIterator<number> {
    const solidVoxel = this.world.createVoxelState('solid')

    R.setRandom('parkmiller', 345678)
    const noise = createNoise3D(R.random)
    const p = new Vector3()

    const sphere = (() => {
      const s = 0.1
      return () => p.length() < 10 + noise(p.x * s, p.y * s, p.z * s) * 3
    })()
    const ground = (() => {
      const s = 0.03
      return () => p.y < noise(p.x * s, p.y * s, p.z * s) * 5 - 2
    })()

    const e = 50 // Extent
    let count = 0
    let now = performance.now()
    for (const { x, y, z, i, size } of loop3({ min: -e, max: e })) {
      p.set(x + 0.5, y + 0.5, z + 0.5)

      const solid =
        (sphere() || ground())
        && this.torus1.test(p) === false
        && this.torus2.test(p) === false
      if (solid) {
        this.world.setVoxelState(x, y, z, solidVoxel)
        count++
      }

      if (performance.now() - now > 20) {
        now = performance.now()
        yield i / size
      }
    }

    yield 1

    console.log(`total voxels: ${count} / ${(e * 2) ** 3}`)
  }

  *getAllChunkGeometries(): IterableIterator<[Vector3, BufferGeometry]> {
    const offset = new Vector3()
    for (const { regionIndex, chunkIndex, chunk } of this.world.enumerateChunks()) {
      this.world.metrics.fromIndexes(regionIndex, chunkIndex, 0, offset)
      yield [offset, createNaiveVoxelGeometry(chunk.allVoxelFaces())]
    }
  }
}

class LightSetup extends Group {
  parts = {
    sun: setup(new DirectionalLight('#ffffff', 1), {
      parent: this,
      position: [14, 24, 10],
    }, sun => {
      sun.castShadow = true
      sun.shadow.intensity = 0.4
      sun.shadow.mapSize.set(4096, 4096)
      sun.shadow.bias = -0.001
      sun.shadow.camera.near = 0.5
      sun.shadow.camera.far = 100
      sun.shadow.camera.left = -50
      sun.shadow.camera.right = 50
      sun.shadow.camera.top = 50
      sun.shadow.camera.bottom = -50
    }),
    sky: setup(new HemisphereLight('#87ceeb', '#3a2d2d', 0.5), this),
  }
}

class Bench {
  static Phase = class {
    start = performance.now()
    elapsed = -1
    stop(now: number = performance.now()) {
      this.elapsed = now - this.start
    }
  }
  currentPhase: string | null = null
  phases: Record<string, InstanceType<typeof Bench.Phase>> = {}

  start(phase: string) {
    if (this.currentPhase) {
      this.phases[this.currentPhase]!.stop()
    }
    this.currentPhase = phase
    this.phases[phase] = new Bench.Phase()
  }

  stop() {
    const now = performance.now()
    if (this.currentPhase) {
      this.phases[this.currentPhase]!.stop(now)
      this.currentPhase = null
    }
  }

  toString() {
    const entries = Object.entries(this.phases)
    if (entries.length === 0) {
      return 'No phases recorded.'
    }
    const longestNameLength = Math.max(...entries.map(([name]) => name.length)) + 1 // +1 for the colon
    return Object.entries(this.phases)
      .map(([name, phase]) => `${`${name}:`.padEnd(longestNameLength)} ${phase.elapsed.toFixed(2)} ms`)
      .join('\n')
  }
}

const colors = [
  '#9fc',
  '#cfc',
  '#33f',
  '#3cf',
  '#f93',
  '#fc3',
]

class MyGTAOPass extends GTAOPass {
  hideBeforeRender = new Set<Object3D>()
  onBeforeRender?: () => void
  onAfterRender?: () => void
  override render(...args: Parameters<GTAOPass['render']>): void {
    for (const obj of this.hideBeforeRender) {
      obj.visible = false
    }
    this.onBeforeRender?.()
    super.render(...args)
    this.onAfterRender?.()
    for (const obj of this.hideBeforeRender) {
      obj.visible = true
    }
  }
}

function MyScene() {
  const three = useThreeWebGL()

  useGroup('my-scene', async function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    three.renderer.shadowMap.enabled = true
    three.renderer.shadowMap.type = PCFShadowMap
    const gtaoPass = new MyGTAOPass(three.scene, three.camera)
    gtaoPass.updateGtaoMaterial({ radius: 1 })
    three.pipeline.addPass(gtaoPass)

    const bench = new Bench()

    // World setup:
    bench.start('world setup')
    const handler = new WorldHandler()

    setup(handler.torus1, group)
    gtaoPass.hideBeforeRender.add(handler.torus1)

    setup(handler.torus2, group)
    gtaoPass.hideBeforeRender.add(handler.torus2)

    setup(new LightSetup(), group)

    await wait('nextFrame')
    for (const p of handler.generate()) {
      Message.send('WORLD_2_PROGRESS', {
        payload: `generation progress: ${(p * 100).toFixed(2)}%`
      })
      await wait('nextFrame')
    }

    // Geometry creation:
    bench.start('geometry creation')
    for (const [offset, geometry] of handler.getAllChunkGeometries()) {
      const mesh = new Mesh(geometry, new MeshPhysicalMaterial({ color: R.pick(colors) }))
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.copy(offset)
      setup(mesh, group)
    }

    bench.stop()
    Message.send('WORLD_2_LOG', {
      payload: `plain voxel count: ${handler.world.computePlainVoxelCount()}`
    })
    Message.send('WORLD_2_LOG', {
      payload: `benchmarks:\n${bench.toString()}`
    })

    let boxCount = 0
    for (const { chunk } of handler.world.enumerateChunks()) {
      for (const _ of chunk.allGreedyBoxes()) {
        boxCount++
      }
    }
    Message.send('WORLD_2_LOG', {
      payload: `total greedy boxes: ${boxCount}`
    })

    const tool = setup(new TransformTool(), group)
    gtaoPass.hideBeforeRender.add(tool)
    yield three.ticker.onTick(() => {
      console.log(...handler.torus2.lr(tool.position))
    })
  })

  return null
}

function UI() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    yield Message.on<string>('WORLD_2_PROGRESS', message => {
      const progress = div.querySelector('#progress')!
      progress.textContent = message.assertPayload().trim()
    })
    yield Message.on<string>('WORLD_2_LOG', message => {
      const logs = div.querySelector('#logs')!
      logs.textContent += message.assertPayload().trim() + '\n'
    })
  }, [])
  return (
    <div
      ref={ref}
      className='layer thru p-8'
    >
      <h1 className='text-2xl font-bold'>
        Voxel World 2
      </h1>
      <div id='progress' className='my-2 whitespace-pre-wrap font-mono text-sm'>
        Progress
      </div>
      <div id='logs' className='my-2 whitespace-pre-wrap font-mono text-sm'>
        Logs
      </div>
    </div>
  )
}

export default function World2Page() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 32,
        rotation: '-25deg, -30deg, 0',
      }}
    >
      <UI />
      <MyScene />
    </ThreeProvider>
  )
}
