'use client'

import { useState } from 'react'
import { Color, IcosahedronGeometry, Mesh, PlaneGeometry, RingGeometry, TorusGeometry, Vector2, Vector3 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { handleSize } from 'some-utils-dom/handle/size'
import { ThreeProvider, useGroup, useThree } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { Ticker } from 'some-utils-ts/ticker'
import { VertigoWidget } from '../general/VertigoWidget'

class AutoLitNoiseMaterial extends AutoLitMaterial {
  constructor(options?: ConstructorParameters<typeof AutoLitMaterial>[0]) {
    super(options)
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms({
        uTime: Ticker.get('three').uTime,
        uColor2: { value: new Color('#ff9ba5') },
      })
      .varying({
        'vWorldPosition2': 'vec3',
      })
      .vertex.mainAfterAll(/* glsl */`
        vWorldPosition2 = (modelMatrix * vec4(transformed, 1.0)).xyz;
      `)
      .fragment.top(
        glsl_stegu_snoise,
      )
      .fragment.after('map_fragment', /* glsl */`
        float noise = fnoise(vWorldPosition2 * vec3(1.0, 1.0, 10.0) * 0.1, 2);
        noise = fract(noise * 5.0);
        diffuseColor.rgb = mix(diffuseColor.rgb, uColor2, noise);
      `)
  }
}

function ThreeSetup() {
  useThree(function* (three) {
    three.scene.background = new Color('#68a5d4')
  }, [])
  return null
}

function PointerHandler() {
  useGroup('pointer-handler', function* (group, three) {
    const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
    controls.inputConfig
    Object.assign(window, { controls })

    const pointerMesh = setup(new Mesh(new TorusGeometry(.06, .01, 32, 96), new AutoLitMaterial({ color: '#f03' })), group)
    const focusMesh = setup(new Mesh(new IcosahedronGeometry(.02, 4), new AutoLitMaterial({ color: '#f03' })), group)

    const screenPoint = new Vector3()
    const vertigo = controls.dampedVertigo
    yield handlePointer(three.domContainer, {
      onTap: () => {
        const [intersection] = three.pointer.raycast(three.scene)
        if (intersection) {
          vertigo
            .ndcToScreen(three.pointer.screenPosition, screenPoint)

          pointerMesh.position.copy(intersection.point)
          controls.vertigo.focus.copy(intersection.point)
          // controls.vertigo.screenOffset.copy(screenPoint)
          // controls.dampedVertigo.copy(controls.vertigo)
        }
      },
      onChange: info => {
        const { x, y } = info.position
        const ndc = new Vector2(
          (x / three.domContainer.clientWidth) * 2 - 1,
          -(y / three.domContainer.clientHeight) * 2 + 1,
        )
        const p = vertigo.ndcToScreen(ndc, new Vector2())
        console.log(...p)
      },
    })

    yield three.ticker.onTick(() => {
      focusMesh.position.copy(controls.dampedVertigo.focus)
      pointerMesh.rotation.copy(controls.dampedVertigo.rotation)
    })
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
    setup(new Mesh(new TorusGeometry(3, .5, 128, 512), new AutoLitNoiseMaterial()), group)
    setup(new Mesh(new TorusGeometry(10, .5, 128, 512), new AutoLitNoiseMaterial()), group)
    setup(new Mesh(new RingGeometry(1, 2, 128), new AutoLitNoiseMaterial()), group)
    setup(new Mesh(new PlaneGeometry(10, 10), new AutoLitNoiseMaterial()), group)
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
      const [, circle1, circle2] = svg.querySelectorAll('circle')
      circle1.setAttribute('cx', `${size * 3 / 10}`)
      circle1.setAttribute('cy', `${size * -2 / 10}`)
      circle2.setAttribute('cx', `${size * -3 / 10}`)
      circle2.setAttribute('cy', `${size * 1 / 10}`)

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
      style={{ pointerEvents: 'none' }}
    >
      <g fill='none' stroke='#ffff00' strokeWidth={.75}>
        <circle r={10} />
        <circle r={10} />
        <circle r={10} />
        <SvgGrid size={gridSize} />
      </g>
    </svg>
  )
}

function HUD() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const screenOffset = div.querySelector('#screenOffset')!
    const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
    yield Ticker.get('three').onTick(() => {
      screenOffset.textContent = controls.vertigo.screenOffset.toArray().slice(0, 2).join(', ')
    })
  }, 'always')
  return (
    <div ref={ref} className='p-4 text-[#ff0] flex flex-col items-start gap-1'>
      <h1 className='text-3xl font-bold'>
        Vertigo Offset
        <br />
        Size: 10
        <br />
        Screen Offset: [<span id='screenOffset'>3, 2</span>]
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

      <button
        className='border border-[#ff0] rounded px-2 py-1 mt-2 text-[#ff0]'
        onClick={() => {
          const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
          controls.vertigo.screenOffset.set(3, 2, 0)
        }}
      >
        [3, 2]
      </button>

      <button
        className='border border-[#ff0] rounded px-2 py-1 mt-2 text-[#ff0]'
        onClick={() => {
          const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
          controls.vertigo.screenOffset.set(0, 0, 0)
        }}
      >
        [0, 0]
      </button>

      <button
        className='border border-[#ff0] rounded px-2 py-1 mt-2 text-[#ff0]'
        onClick={() => {
          const controls = Message.send<VertigoControls>('VERTIGO_CONTROLS').assertPayload()
          controls.vertigo.screenOffset.set(-3, -1, 0)
        }}
      >
        [-3, -1]
      </button>
    </div>

  )
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
        // screenOffset: [3, 2, 0],
        // rotation: `30deg, 30deg, 0deg`,
        // zoom: 2,
        inputConfig: {
          wheel: 'zoom',
        },
      }}
    >
      <div className='layer thru flex flex-col items-start justify-start'>
        <HUD />
      </div>
      <ThreeSetup />
      <MyScene />
      <PointerHandler />
      <SvgSight />
    </ThreeProvider>
  )
}
