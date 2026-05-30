'use client'
import { Euler, Mesh, Quaternion, Vector3 } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ChangeInfo, InspectorView, UserEvent } from 'some-utils-misc/inspector'
import { ThreeProvider, useGroup, useThree } from 'some-utils-misc/three-provider'
import { Defer } from 'some-utils-react/components/defer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { RoundedAxesGeometry } from 'some-utils-three/geometries/RoundedAxesGeometry'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { find } from 'some-utils-three/utils/tree/find'
import { deepCopy } from 'some-utils-ts/object/deep'

function normalizeQuaternion(value: Quaternion, key: string) {
  let { x, y, z, w } = value
  switch (key) {
    case 'x': {
      const r1 = Math.sqrt(1 - x * x)
      const r2 = Math.sqrt(y * y + z * z + w * w)
      if (r1 === 0) {
        y = z = w = 0
      }
      else if (r2 === 0) {
        y = z = w = Math.sqrt((1 - x * x) / 3)
      }
      else {
        const s = r1 > 0 ? r1 / r2 : 0
        y *= s
        z *= s
        w *= s
      }
      break
    }

    case 'y': {
      const r1 = Math.sqrt(1 - y * y)
      const r2 = Math.sqrt(x * x + z * z + w * w)
      if (r1 === 0) {
        x = z = w = 0
      }
      else if (r2 === 0) {
        x = z = w = Math.sqrt((1 - y * y) / 3)
      }
      else {
        const s = r1 > 0 ? r1 / r2 : 0
        x *= s
        z *= s
        w *= s
      }
      break
    }

    case 'z': {
      const r1 = Math.sqrt(1 - z * z)
      const r2 = Math.sqrt(x * x + y * y + w * w)
      if (r1 === 0) {
        x = y = w = 0
      }
      else if (r2 === 0) {
        x = y = w = Math.sqrt((1 - z * z) / 3)
      }
      else {
        const s = r1 > 0 ? r1 / r2 : 0
        x *= s
        y *= s
        w *= s
      }
      break
    }

    case 'w': {
      const r1 = Math.sqrt(1 - w * w)
      const r2 = Math.sqrt(x * x + y * y + z * z)
      if (r1 === 0) {
        x = y = z = 0
      }
      else if (r2 === 0) {
        x = y = z = Math.sqrt((1 - w * w) / 3)
      }
      else {
        const s = r1 > 0 ? r1 / r2 : 0
        x *= s
        y *= s
        z *= s
      }
      break
    }

    default: {
      console.warn('Unknown quaternion key', key)
      break
    }
  }
  value.set(x, y, z, w)
}

function Content3D() {
  useGroup('content3d', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    const mesh = setup(new Mesh(
      new RoundedAxesGeometry(),
      new AutoLitMaterial({ vertexColors: true }),
    ), group)

  }, [])
  return null
}

const rotationMeta = `
  vector(x,y,z)
  slider(-PI, PI, 1 / 180 * PI)
  slider-fill(none)
  remap(to-degrees)
  precision(1)
  widget(rotate-3d)
`

function InspectorComponent() {
  const three = useThree()
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const inspector1 = new InspectorView()
    const mesh = find(three.scene, Mesh)!
    console.log('Mesh found', mesh)
    inspector1.registerFields([
      {
        key: 'position',
        description: 'Position of the mesh in 3D space with (1, 2, 0) as default.',
        type: 'vector(x, y, z) slider(-5, 5) slider-fill(none) widget(translate-3d)',
        value: new Vector3(1, 2, 0),
      },
      {
        key: 'rotation',
        type: rotationMeta,
        value: new Euler(0, 0, 0, 'ZYX'),
      },
      {
        key: 'quaternion',
        type: 'vector(x, y, z, w) slider(-1, 1) slider-fill(none)',
        value: mesh.quaternion,
        sanitizeValue: (value: Quaternion, info: ChangeInfo) => {
          if (info.userEvent === UserEvent.Drag) {
            normalizeQuaternion(value, info.subKey ?? 'x')
          }
          return value
        },
      },
      {
        key: 'reset-rotation',
        type: 'button',
        value: () => {
          mesh.rotation.set(0, 0, 0)
        },
      },
      {
        key: 'reset-position',
        type: 'button',
        value: () => {
          mesh.position.set(0, 0, 0)
        }
      },
    ], {
      updatedValues: () => {
        return {
          position: mesh.position,
          rotation: mesh.rotation,
          quaternion: mesh.quaternion,
        }
      },
    })
    yield inspector1.onAnyChange((key, value) => {
      deepCopy(value, (mesh as any)[key])
    })
    yield inspector1.attachTo(div)
  }, [])

  return (
    <div
      ref={ref}
      className='flex-1 w-[300px]'
    />
  )
}

function UI() {
  return (
    <div className='layer thru p-8 flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>
        Quaternion Inspector
      </h1>
      <FpsMeter />
      <Defer>
        <InspectorComponent />
      </Defer>
    </div>
  )
}

export default function Page() {
  return (
    <ThreeProvider
      vertigoControls={{
        rotation: '-20deg, -20deg, 0',
        eventTarget: 'canvas',
      }}
    >
      <UI />
      <Content3D />
    </ThreeProvider>
  )
}