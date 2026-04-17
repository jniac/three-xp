'use client'

import { AmbientLight, BoxGeometry, DirectionalLight, IcosahedronGeometry, Mesh, MeshPhysicalMaterial, PCFShadowMap } from 'three'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'

import { Inspector, MetaProperty } from 'some-utils-misc/inspector'
import { ThreeProvider, useGroup, useThree, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { PassType } from 'some-utils-three/contexts/webgl'
import { createNaiveChunkGeometries, World } from 'some-utils-three/experimental/voxel'
import { setup } from 'some-utils-three/utils/tree'
import { loop3 } from 'some-utils-ts/iteration/loop'
import { Message } from 'some-utils-ts/message'

import { JoltPhysicsProvider, Physics, useJoltPhysics } from '@/physics/jolt'

function ThreeSettings() {
  useThreeWebGL(async function* (three) {
    const aoPass = new GTAOPass(three.scene, three.camera)
    aoPass.updateGtaoMaterial({
      radius: 1,
      distanceExponent: 1,
      thickness: 2,
      scale: 1,
      samples: 16,
      distanceFallOff: 1,
      screenSpaceRadius: false,
    })
    aoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 4,
      radiusExponent: 1,
      rings: 4,
      samples: 16,
    })
    three.pipeline.addPass(aoPass, { type: PassType.PostProcessing })
    yield () => three.pipeline.removePass(aoPass)
  }, [])

  return null
}

function Lights() {
  useThreeWebGL(function* (three) {
    three.renderer.shadowMap.enabled = true
    three.renderer.shadowMap.type = PCFShadowMap
  }, [])

  useGroup('lights', function* (group, three) {
    const sun = new DirectionalLight(0xffffff, 1)
    sun.position.set(1, 4, 2)
    sun.castShadow = true
    sun.shadow.camera.top = 10
    sun.shadow.camera.bottom = -10
    sun.shadow.camera.left = -10
    sun.shadow.camera.right = 10
    sun.shadow.camera.near = 0.1
    sun.shadow.camera.far = 100
    sun.shadow.bias = -.0001
    sun.shadow.normalBias = .0001
    sun.shadow.mapSize.width = 2048
    sun.shadow.mapSize.height = 2048
    sun.shadow.radius = 1
    sun.shadow.blurSamples = 25
    group.add(sun)

    const ambientLight = new AmbientLight(0xffffff, 0.5)
    group.add(ambientLight)
  }, [])

  return null
}

function MyScene() {
  const three = useThree()
  const jolt = useJoltPhysics()

  useGroup('my-scene', async function* (group) {
    const world = new World()

    const plainVoxel = world.createVoxelState(0xffffffff)

    const r = 4
    for (const { x, y, z } of loop3({ min: -r, max: r + 1 })) {
      if (Math.hypot(x + .5, y + .5, z + .5) < r) {
        world.setVoxelState(x, y, z, plainVoxel)
      }
    }

    for (const { x, y, z } of loop3({ min: [0, -4, 0], max: [8, 0, 8] })) {
      world.setVoxelState(x, y, z, plainVoxel)
    }

    for (const { x, y, z } of loop3({ min: [0, -4, 0], max: [5, 1, 5] })) {
      world.setVoxelState(x, y, z, plainVoxel)
    }

    const colors = [
      '#fc3', '#9cf', '#59f', '#f9f', '#9f9', '#ffa', '#f99', '#9ff', '#99f',
      '#ea0', '#6af', '#26d', '#f6f', '#3f9', '#ed3', '#f66', '#3cc', '#66f',
    ]

    for (const [i, geometry] of createNaiveChunkGeometries(world).entries()) {
      const material = new MeshPhysicalMaterial({ color: colors[i % colors.length], wireframe: true })
      const mesh = new Mesh(geometry, material)
      // group.add(mesh)
    }

    for (const { chunk } of world.enumerateChunks()) {
      for (const box of chunk.allGreedyBoxes()) {
        const { min, max } = box
        const geometry = new BoxGeometry(max.x - min.x, max.y - min.y, max.z - min.z)
          .translate((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2)
        const material = new MeshPhysicalMaterial({
          // color: colors[i % colors.length]
        })
        const mesh = new Mesh(geometry, material)
        mesh.receiveShadow = true
        mesh.castShadow = true
        mesh.position.copy(chunk.mountState!.worldPosition)
        mesh.userData.physics = { mass: 0 }
        group.add(mesh)

        jolt.createBody({
          type: Physics.MotionType.STATIC,
          shape: new Physics.Shape.Box([(max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2]),
          mesh,
          position: [
            chunk.mountState!.worldPosition.x + (min.x + max.x) / 2,
            chunk.mountState!.worldPosition.y + (min.y + max.y) / 2,
            chunk.mountState!.worldPosition.z + (min.z + max.z) / 2,
          ],
          parent: group,
        })
      }
    }

    setup(new Mesh(new IcosahedronGeometry(1, 10), new MeshPhysicalMaterial()), {
      position: [4, 3, 4],
      parent: group,
      receiveShadow: true,
      castShadow: true,
      userData: {
        physics: { mass: 1 }
      },
    })
    // setup(new Mesh(new CylinderGeometry(.5, .5, 10), new MeshPhysicalMaterial()), {
    //   position: [4, 3, 4],
    //   parent: group,
    //   receiveShadow: true,
    //   castShadow: true,
    // })

    const ball = jolt.createBody({
      type: Physics.MotionType.DYNAMIC,
      shape: new Physics.Shape.Sphere(1),
      position: [2, 10, 2],
      parent: group,
    })
    ball.mesh.material = new MeshPhysicalMaterial()

  }, [])

  return null
}

function InspectorWrapper() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const inspector = new Inspector({
      header: {
        title: 'Inspector',
        closeButton: true,
      },
      search: true,
    })
    div.appendChild(inspector.div)
    yield inspector.destroy
    yield Message.dispatchInstance(Inspector, inspector)

    inspector.registerFields([
      new MetaProperty({
        key: 'foo',
        type: `
          number
          clamped
          slider(0, 10, .05)
          modifierScale(2)
          round(.001)
          dragScale(10)
        `,
        description: 'This is a slider for foo.',
        value: 5,
      }),
    ], {
      updatedValues: () => {
        return { foo: 2 }
      }
    })
  }, [])

  return <div ref={ref} />
}

export function PageClient() {
  return (
    <ThreeProvider
      fxaa
      vertigoControls={{
        size: 30,
        rotation: '-30deg, 30deg, 0deg',
      }}
    >
      <JoltPhysicsProvider>
        <div className='p-8 thru'>
          <h1>
            Graphic Art 4
          </h1>
          <InspectorWrapper />
        </div>
        <ThreeSettings />
        <Lights />
        <MyScene />
      </JoltPhysicsProvider>
    </ThreeProvider>
  )
}