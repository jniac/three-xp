'use client'
import { Euler, Quaternion, Vector3 } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ChangeInfo, InspectorView, UserEvent } from 'some-utils-misc/inspector'
import { ThreeProvider, useThree } from 'some-utils-misc/three-provider'
import { Defer } from 'some-utils-react/components/defer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { find } from 'some-utils-three/utils/tree/find'
import { deepCopy } from 'some-utils-ts/object/deep'
import { Content3D } from './Content3D'

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
        const s = r1 / r2
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
        const s = r1 / r2
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
        const s = r1 / r2
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
        const s = r1 / r2
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
    const mesh = find(three.scene, 'QuaternionMesh')!
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
      className='flex-1'
    />
  )
}

function UI() {
  const Panel = ({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={`w-fit flex p-2 rounded-lg border border-white/20 ${className ?? ''}`}
      style={{
        backdropFilter: 'blur(32px) brightness(1.5)',
        ...style,
      }}
      {...props}
    />
  )
  return (
    <div className='layer thru p-8 flex flex-col gap-1'>
      <h1 className='text-2xl font-bold'>
        Quaternion Inspector
      </h1>
      <FpsMeter />
      <Defer>
        <Panel>
          <InspectorComponent />
        </Panel>
      </Defer>
      <Panel className='w-[298px] flex flex-col gap-2 text-white/80'>
        <h2>
          Reminder:
        </h2>
        <p className='text-xs'>
          q1^-1 * q2 is not equal to q2 * q1^-1. The order of multiplication matters in quaternions, and it can be used to achieve different rotations.
        </p>
      </Panel>
    </div>
  )
}

export default function Page() {
  return (
    <ThreeProvider
      vertigoControls={{
        rotation: '-20deg, -20deg, 0',
        eventTarget: 'canvas',
        size: 10,
      }}
    >
      <UI />
      <Content3D />
    </ThreeProvider>
  )
}