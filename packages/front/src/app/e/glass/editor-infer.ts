import { Mesh, MeshPhysicalMaterial, Object3D } from 'three'

import { InspectorView, positionMeta, rotationMeta } from 'some-utils-misc/inspector'
import { deepAssign } from 'some-utils-ts/object/deep'

export function createObject3DInspector(object: Object3D, div: HTMLDivElement) {
  const inspector = new InspectorView()
  inspector.registerFields([
    {
      key: 'visible',
      type: 'boolean',
      value: object.visible,
    },
    {
      key: 'position',
      type: positionMeta,
      value: object.position,
    },
    {
      key: 'scale',
      type: 'vector(x,y,z)',
      value: object.scale,
    },
    {
      key: 'rotation',
      type: rotationMeta,
      value: object.rotation,
    },
  ], {
    updatedValues: () => object,
  })
  inspector.onAnyChange((key, value) => {
    deepAssign(object, { [key]: value })
    const currentValue = (object as any)[key]
    if (currentValue && typeof currentValue === 'object' && '_onChangeCallback' in currentValue) {
      currentValue._onChangeCallback() // for rotation, to update the quaternion
    }
  })
  div.appendChild(inspector.div)

  if (object instanceof Mesh) {
    if (object.material instanceof MeshPhysicalMaterial) {
      createMeshPhysicalMaterialInspector(object.material, div)
    }
  }
}

export function createMeshPhysicalMaterialInspector(material: MeshPhysicalMaterial, div: HTMLDivElement) {
  const materialInspector = new InspectorView()
  materialInspector.registerFields([
    {
      key: 'transmission',
      type: 'number slider(0,1)',
      value: material.transmission,
    },
    {
      key: 'roughness',
      type: 'number slider(0,1)',
      value: material.roughness,
    },
    {
      key: 'metalness',
      type: 'number slider(0,1)',
      value: material.metalness,
    },
    {
      key: 'clearcoat',
      type: 'number slider(0,1)',
      value: material.clearcoat,
    },
    {
      key: 'clearcoatRoughness',
      type: 'number slider(0,1)',
      value: material.clearcoatRoughness,
    },
    {
      key: 'ior',
      type: 'number slider(1,20) middle(2)',
      value: material.ior,
    },
    {
      key: 'dispersion',
      type: 'number slider(0,10) middle(1)',
      value: material.dispersion,
    },
    {
      key: 'iridescence',
      type: 'number slider(0,1)',
      value: material.iridescence,
    },
    {
      key: 'iridescenceIOR',
      type: 'number slider(1,20) middle(2)',
      value: material.iridescenceIOR,
    }
  ], {
    updatedValues: () => material,
  })
  materialInspector.onAnyChange((key, value) => {
    deepAssign(material, { [key]: value })
  })
  div.appendChild(materialInspector.div)
}