import { attribute, Fn, If, instanceIndex, objectWorldMatrix, storage, uniform, vec4 } from 'three/tsl'
import { MeshNormalNodeMaterial, StorageBufferAttribute } from 'three/webgpu'

export function createJelly() {
  const pointerPosition = uniform(vec4(0))
  const elasticity = uniform(.4) // elasticity ( how "strong" the spring is )
  const damping = uniform(.94) // damping factor ( energy loss )
  const brushSize = uniform(.25)
  const brushStrength = uniform(.22)

  // @ts-ignore
  const jellyFn = Fn(({ renderer, geometry, object }) => {

    const count = geometry.attributes.position.count

    // replace geometry attributes for storage buffer attributes

    const positionBaseAttribute = geometry.attributes.position
    const positionStorageBufferAttribute = new StorageBufferAttribute(count, 3)
    const speedBufferAttribute = new StorageBufferAttribute(count, 3)

    geometry.setAttribute('storagePosition', positionStorageBufferAttribute)

    // attributes

    const positionAttribute = storage(positionBaseAttribute, 'vec3', count)
    const positionStorageAttribute = storage(positionStorageBufferAttribute, 'vec3', count)

    const speedAttribute = storage(speedBufferAttribute, 'vec3', count)

    // vectors

    const basePosition = positionAttribute.element(instanceIndex)
    const currentPosition = positionStorageAttribute.element(instanceIndex)
    const currentSpeed = speedAttribute.element(instanceIndex)

    // @ts-ignore
    const computeInit = Fn(() => {

      // copy position to storage

      currentPosition.assign(basePosition)

      // @ts-ignore
    })().compute(count)

    //

    // @ts-ignore
    const computeUpdate = Fn(() => {

      // pinch

      If(pointerPosition.w.equal(1), () => {

        const worldPosition = objectWorldMatrix(object).mul(currentPosition)

        const dist = worldPosition.distance(pointerPosition.xyz)
        const direction = pointerPosition.xyz.sub(worldPosition).normalize()

        const power = brushSize.sub(dist).max(0).mul(brushStrength).mul(.25)

        currentPosition.addAssign(direction.mul(power))

      })

      // compute ( jelly )

      const distance = basePosition.distance(currentPosition)
      const force = elasticity.mul(distance).mul(basePosition.sub(currentPosition)).mul(.5)

      currentSpeed.addAssign(force)
      currentSpeed.mulAssign(damping)

      currentPosition.addAssign(currentSpeed)

      // @ts-ignore
    })().compute(count)

    // initialize the storage buffer with the base position
    computeUpdate.onInit(() => renderer.compute(computeInit))

    return computeUpdate
  })

  const material = new MeshNormalNodeMaterial({
    // wireframe: true,
  })
  material.geometryNode = jellyFn()
  material.positionNode = attribute('storagePosition')

  return {
    material,
    pointerPosition,
    elasticity,
    damping,
    brushSize,
    brushStrength,
  }
}
