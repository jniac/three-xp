import JoltModule from 'jolt-physics/wasm-compat'
import { BoxGeometry, IcosahedronGeometry, Mesh, Object3D } from 'three'

import { EulerDeclaration } from 'some-utils-three/declaration'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/types'
import { fromVector3Declaration, Vector3Declaration } from 'some-utils-ts/declaration'

import { Jolt, loadJolt } from './core'
import { fromQuat, fromRVec3, toQuat, toRVec3, toVec3 } from './utils'

export enum MotionType {
  /**
   * Jolt.EMotionType_Static (0)
   */
  STATIC = 0,
  /**
   * Jolt.EMotionType_Kinematic (1)
   */
  KINEMATIC = 1,
  /**
   * Jolt.EMotionType_Dynamic (2)
   */
  DYNAMIC = 2,
}

export enum AllowedDOF {
  All = 63,
  Plane2D = 35,
  RotationX = 8,
  RotationY = 16,
  RotationZ = 32,
  TranslationX = 1,
  TranslationY = 2,
  TranslationZ = 4,
}

export enum Layers {
  STATIC = 0,
  MOVING = 1,
}

export const LayersCount = Object.keys(Layers).length / 2 // / 2 because it's an enum with keys and values

abstract class Shape {
  static Sphere = class extends Shape {
    constructor(public radius: number) {
      super()
    }

    toJoltShape(): JoltModule.Shape {
      return new Jolt.SphereShape(this.radius)
    }

    toMesh(): Mesh {
      return new Mesh(new IcosahedronGeometry(this.radius, 8))
    }
  }

  static Box = class extends Shape {
    constructor(public halfExtents: Vector3Declaration) {
      super()
    }

    toJoltShape(): JoltModule.Shape {
      const halfExtents = toVec3(this.halfExtents, new Jolt.Vec3())
      return new Jolt.BoxShape(halfExtents)
    }

    toMesh(): Mesh {
      const { x, y, z } = fromVector3Declaration(this.halfExtents)
      return new Mesh(new BoxGeometry(x * 2, y * 2, z * 2))
    }
  }

  toJoltShape(): JoltModule.Shape {
    throw new Error('Not implemented')
  }

  toMesh(): Mesh {
    throw new Error('Not implemented')
  }
}

export class Physics {
  static MotionType = MotionType
  static AllowedDOF = AllowedDOF
  static Layers = Layers
  static Shape = Shape
}

export async function initJolt(three: ThreeBaseContext) {
  // Initialize Jolt
  await loadJolt()

  const settings = new Jolt.JoltSettings()
  settings.mMaxWorkerThreads = 3

  const objectFilter = new Jolt.ObjectLayerPairFilterTable(LayersCount)
  objectFilter.EnableCollision(Layers.STATIC, Layers.MOVING)
  objectFilter.EnableCollision(Layers.MOVING, Layers.MOVING)

  const BP_LAYER_NON_MOVING = new Jolt.BroadPhaseLayer(0)
  const BP_LAYER_MOVING = new Jolt.BroadPhaseLayer(1)
  const NUM_BROAD_PHASE_LAYERS = 2

  const bpInterface = new Jolt.BroadPhaseLayerInterfaceTable(LayersCount, NUM_BROAD_PHASE_LAYERS)
  bpInterface.MapObjectToBroadPhaseLayer(Layers.STATIC, BP_LAYER_NON_MOVING)
  bpInterface.MapObjectToBroadPhaseLayer(Layers.MOVING, BP_LAYER_MOVING)

  settings.mObjectLayerPairFilter = objectFilter
  settings.mBroadPhaseLayerInterface = bpInterface
  settings.mObjectVsBroadPhaseLayerFilter = new Jolt.ObjectVsBroadPhaseLayerFilterTable(
    bpInterface,
    NUM_BROAD_PHASE_LAYERS,
    objectFilter,
    LayersCount,
  )

  const jolt = new Jolt.JoltInterface(settings)
  Jolt.destroy(settings)

  const objects = {
    moving: [] as { mesh: Mesh, body: JoltModule.Body }[],
  }
  const physicsSystem = jolt.GetPhysicsSystem()
  const bodyInterface = physicsSystem.GetBodyInterface()

  const createBody = ({
    shape = <Shape>new Shape.Sphere(.5),
    type = MotionType.DYNAMIC,
    allowedDOFs = AllowedDOF.All,
    mesh = null as Mesh | null,
    position = <Vector3Declaration>[0, 0, 0],
    rotation = <EulerDeclaration>[0, 0, 0],
    parent = <Object3D>three.scene,
  } = {}) => {
    const settings = new Jolt.BodyCreationSettings(
      shape.toJoltShape(),
      toRVec3(position, new Jolt.RVec3()),
      toQuat(rotation, new Jolt.Quat()),
      type,
      Layers.MOVING,
    )

    settings.mAllowedDOFs = allowedDOFs

    const body = bodyInterface.CreateBody(settings)
    Jolt.destroy(settings)
    bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate)

    mesh ??= shape.toMesh()
    parent.add(mesh)

    const bundle = { body, mesh }

    if (type === MotionType.KINEMATIC || type === MotionType.DYNAMIC) {
      objects.moving.push(bundle)
    }

    return bundle
  }

  const update = (deltaTime: number) => {
    // When running below 55 Hz, do 2 steps instead of 1
    const numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1
    jolt.Step(deltaTime, numSteps)

    for (const { mesh, body } of objects.moving) {
      fromRVec3(body.GetPosition(), mesh.position)
      fromQuat(body.GetRotation(), mesh.quaternion)
    }
  }

  three.ticker.onTick(tick => {
    update(tick.deltaTime)
  })

  return {
    jolt,
    physicsSystem,
    bodyInterface,
    createBody,
  }
}

