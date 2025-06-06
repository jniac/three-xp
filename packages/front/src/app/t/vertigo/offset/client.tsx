'use client'

import { Color, Mesh, TorusGeometry } from 'three'

import { handleSize } from 'some-utils-dom/handle/size'
import { ThreeProvider, useGroup, useThree } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

import { useState } from 'react'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { VertigoWidget } from '../general/VertigoWidget'

function ThreeSetup() {
  useThree(function* (three) {
    three.scene.background = new Color('#68a5d4')
    const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
    controls.inputConfig
    Object.assign(window, { controls })
  }, [])
  return null
}

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({
        size: 100,
        subdivisions: [10, 10, 4],
        color: '#ffffff',
        opacity: [1, .3, .1],
      })
      .circle({ radius: 5, quality: 'ultra' }, { color: '#ffffff' })
    setup(new VertigoWidget(), group)
    setup(new Mesh(new TorusGeometry(10, .5, 32, 512), new AutoLitMaterial()), group)
  }, [])
  return null
}

function SvgGrid({ size = 100, subdivisions = 10, ...props }: {
  size?: number
  subdivisions?: number
} & React.SVGProps<SVGGElement>) {
  const { ref } = useEffects<SVGGElement>(function* (g) {
    const lines = [...g.querySelectorAll('line')]
    const step = size / subdivisions
    for (let ix = 0; ix <= subdivisions; ix++) {
      const iy = ix + subdivisions + 1
      const offset = ix * step - size / 2
      lines[ix].setAttribute('x1', `${offset}`)
      lines[ix].setAttribute('x2', `${offset}`)
      lines[ix].setAttribute('y1', `${-size / 2}`)
      lines[ix].setAttribute('y2', `${size / 2}`)
      lines[iy].setAttribute('x1', `${-size / 2}`)
      lines[iy].setAttribute('x2', `${size / 2}`)
      lines[iy].setAttribute('y1', `${offset}`)
      lines[iy].setAttribute('y2', `${offset}`)
    }
  }, 'always')
  return (
    <g ref={ref} {...props}>
      {Array.from({ length: (subdivisions + 1) * 2 }, (_, i) => (
        <line key={i} />
      ))}
    </g>
  )
}

function SvgSight() {
  const [gridSize, setGridSize] = useState(100)
  const { ref } = useEffects<SVGSVGElement>(function* (svg) {
    const resize = (w: number, h: number) => {
      svg.setAttribute('width', `${w}`)
      svg.setAttribute('height', `${h}`)
      const w2 = w / 2
      const h2 = h / 2
      svg.setAttribute('viewBox', `-${w2} -${h2} ${w} ${h}`)

      const size = Math.min(w, h)
      const [, circle] = svg.querySelectorAll('circle')
      circle.setAttribute('cx', `${size * 3 / 10}`)
      circle.setAttribute('cy', `${-size * 2 / 10}`)

      setGridSize(size)
    }
    yield handleSize(window, {
      onSize: ({ size }) => {
        resize(size.x, size.y)
      },
    })
  }, [])
  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
    >
      <g fill='none' stroke='#ffff00' strokeWidth={.75}>
        <circle r={5} />
        <circle r={5} />
        <SvgGrid size={gridSize} />
      </g>
    </svg>
  )
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
        screenOffset: [3, 2, 0],
        // rotation: `30deg, 30deg, 0deg`,
        zoom: 2,
        inputConfig: {
          wheel: 'zoom',
        }
      }}
    >
      <div className={`layer thru p-4 text-[#ff0]`}>
        <h1 className='text-3xl font-bold'>
          Vertigo Offset
          <br />
          Size: 10
          <br />
          Screen Offset: [3, 2, 0]
        </h1>
        <p>
          When the subject is not at the center...
        </p>
        <button
          className='border border-[#ff0] rounded px-2 py-1 mt-2 text-[#ff0]'
          onClick={() => {
            const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
            controls.vertigo.perspective = controls.vertigo.perspective === 1 ? 0 : 1
          }}
        >
          Toggle perspective
        </button>
      </div>
      <ThreeSetup />
      <MyScene />
      <SvgSight />
    </ThreeProvider>
  )
}
