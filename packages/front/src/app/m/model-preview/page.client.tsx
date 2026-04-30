'use client'

import { useState } from 'react'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DebugHelper } from 'some-utils-three/helpers/debug/debug-helper'
import { setup } from 'some-utils-three/utils/tree'
import { AnimationMixer, Color, Group, Object3D, Vector3 } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const fbxLoader = new FBXLoader()

function handleEvent<Target extends EventTarget, EventType extends Event>(
  target: Target,
  listeners: Record<string, (event: EventType) => void>,
) {
  for (const [event, handler] of Object.entries(listeners)) {
    target.addEventListener(event, handler as EventListener)
  }
  return () => {
    for (const [event, handler] of Object.entries(listeners)) {
      target.removeEventListener(event, handler as EventListener)
    }
  }
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.scene.background = new Color('hsl(200, 20%, 10%)')
  useGroup('three-settings', function* (group) {
    setup(new DebugHelper().regularGrid(), group)
  }, [])
  return null
}

function* traverse(root: Object3D): Generator<{ node: Object3D, depth: number }> {
  const stack = [{ node: root, depth: 0 }]
  while (stack.length > 0) {
    const { node, depth } = stack.pop()!
    yield { node, depth }
    for (const child of node.children) {
      stack.push({ node: child, depth: depth + 1 })
    }
  }
}

function GltfScene({ gltf }: { gltf: GLTF }) {
  const [state, setState] = useState({
    animationIndex: 0,
    animationHelperSkipLevel: 2,
  })
  useGroup('animation-scene', function* (group, three) {
    const wrapper = setup(new Group(), {
      parent: group,
      // scale: 0.1
    })
    wrapper.add(gltf.scene)

    const debugHelper = setup(new DebugHelper(), group).zOffset({ points: .01 }).onTop()
    const v0 = new Vector3(), v1 = new Vector3()
    yield three.ticker.onTick(tick => {
      debugHelper.clear()

      for (const { node, depth } of traverse(gltf.scene)) {
        if (depth < state.animationHelperSkipLevel)
          continue

        debugHelper.point(node.getWorldPosition(v0), { color: 'red', shape: 'circle', size: .1 })
        for (const x of node.children) {
          debugHelper.line(node.getWorldPosition(v0), x.getWorldPosition(v1), { color: 'red' })
        }
      }
    })

    if (gltf.animations.length > 0) {
      const mixer = new AnimationMixer(three.scene)
      const animation = gltf.animations[state.animationIndex]
      mixer.clipAction(animation).play()
      console.log('Playing animation:', animation.name)
      Object.assign(window, { animation })
      yield three.ticker.onTick(tick => {
        mixer.update(tick.deltaTime)
      })
    }

  }, [gltf.asset])
  return (
    <div className='p-8 flex flex-col items-end'>
      <div
        onClick={() => {
          setState(s => ({ ...s, animationIndex: (s.animationIndex + 1) % gltf.animations.length }))
        }}
      >
        #{state.animationIndex}: {gltf.animations.at(state.animationIndex)?.name}
      </div>
    </div>
  )
}

function PreviewScene() {
  const [state, setState] = useState({
    gltf: null as null | GLTF,
  })

  const three = useThreeWebGL()

  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const group = setup(new Group(), three.scene)
    yield () => group.clear().removeFromParent()

    const debugHelper = setup(new DebugHelper(), group).zOffset({ points: .01 }).onTop()

    const mixers = [] as AnimationMixer[]
    yield three.ticker.onTick(tick => {
      for (const mixer of mixers) {
        mixer.update(tick.deltaTime)
      }

      debugHelper.clear()
      const v0 = new Vector3(), v1 = new Vector3()
      group.traverse(child => {
        debugHelper.point(child.getWorldPosition(v0), { color: 'red', shape: 'circle', size: .1 })
        for (const x of child.children) {
          debugHelper.line(child.getWorldPosition(v0), x.getWorldPosition(v1), { color: 'red' })
        }
      })
    })

    yield handleEvent(div, {
      dragover: (event: DragEvent) => {
        event.preventDefault()
      },
      drop: async (event: DragEvent) => {
        event.preventDefault()
        if (event.dataTransfer) {
          const { files: [file] } = event.dataTransfer
          if (file) {
            if (file.name.endsWith('.fbx')) {
              const object = fbxLoader.parse(await file.arrayBuffer(), '')
              throw new Error('Not implemented')
            }

            if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
              const gltfLoader = new GLTFLoader()
              const gltf = await gltfLoader.parseAsync(await file.arrayBuffer(), '')
              setState(v => ({ ...v, gltf }))
            }
          }
        }
      },
    })

    const gltfLoader = new GLTFLoader()
    const gltf = await gltfLoader.loadAsync('/assets/meshes/bwd_dance.glb')
    setState(v => ({ ...v, gltf }))
  }, [])

  return (
    <div ref={ref} className='absolute-through'>
      {state.gltf && (
        <GltfScene gltf={state.gltf} />
      )}
    </div>
  )
}

export function PageClient() {
  return (
    <div className='layer p-4'>
      <ThreeProvider
        vertigoControls={{
          size: 5,
        }}
      >
        <div className='layer thru p-8'>
          <div className='w-[400px]'>
            <h1 className='text-2xl font-bold'>
              Model preview
            </h1>
            <p>
              Drag and drop a GLTF/GLB or FBX file onto the canvas to preview it. (Note: FBX support is very experimental and may not work with many files)
            </p>
          </div>
        </div>
        <ThreeSettings />
        <PreviewScene />
      </ThreeProvider >
    </div>

  )
}
