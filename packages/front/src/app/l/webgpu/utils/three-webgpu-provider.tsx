'use client'

import { createContext, CSSProperties, HTMLAttributes, useContext, useMemo } from 'react'
import { Group, Object3D } from 'three/webgpu'

import { useEffects, UseEffectsCallback, UseEffectsDeps, UseEffectsEffect, UseEffectsReturnable, useLayoutEffects } from 'some-utils-react/hooks/effects'
import { useIsClient } from 'some-utils-react/hooks/is-client'
import { VertigoProps } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebGPUContext } from 'some-utils-three/experimental/contexts/webgpu'
import { onTick } from 'some-utils-ts/ticker'

const reactThreeContext = createContext<ThreeWebGPUContext>(null!)

export function useThree(
  effects?: UseEffectsCallback<ThreeWebGPUContext>,
  deps?: UseEffectsDeps,
): ThreeWebGPUContext {
  const three = useContext(reactThreeContext)

  useEffects(async function* (_, state) {
    if (effects) {
      const it = effects(three, state)
      if (it && typeof it.next === 'function') {
        do {
          const { value, done } = await it.next()
          if (done) break
          yield value
        } while (state.mounted)
      }
    }
  }, deps ?? 'always')

  return three
}

export function useGroup(
  name: string,
  effects?: (group: Group, three: ThreeWebGPUContext, state: UseEffectsEffect) => UseEffectsReturnable,
  deps?: UseEffectsDeps,
): Group {
  const group = useMemo(() => new Group(), [])
  group.name = name

  useThree(async function* (three, state) {
    three.scene.add(group)
    yield () => {
      group.clear()
      group.removeFromParent()
    }

    if (effects) {
      const it = effects(group, three, state)
      if (it && typeof it.next === 'function') {
        do {
          const { value, done } = await it.next()
          if (done) break
          yield value
        } while (state.mounted)
      }
    }
  }, deps)

  return group
}

export function ThreeInstance({ value }: { value: Object3D | (new (...args: any[]) => Object3D) }) {
  useThree(async function* (three) {
    const instance = typeof value === 'function' ? new value() : value
    three.scene.add(instance)
    if ('onInitialize' in instance) {
      const result = (instance as any).onInitialize(three)
      if (result && typeof result.next === 'function') {
        do {
          const { value, done } = await result.next()
          if (done) break
          yield value
        } while (true)
      }
    }
    yield () => {
      instance.removeFromParent()
      if ('onDestroy' in instance) {
        (instance as any).onDestroy?.()
      }
    }
  }, 'always')
  return null
}

const defaultProps = {
  className: '',
  assetsPath: '/',
  vertigoControls: false as boolean | VertigoProps,
}

type Props = HTMLAttributes<HTMLDivElement> & Partial<typeof defaultProps>

function ServerProofThreeProvider(props: Props) {
  const { children, className, vertigoControls: vertigo } = { ...defaultProps, ...props }

  const three = useMemo(() => new ThreeWebGPUContext(), [])
  // three.loader.setPath(assetsPath)

  const { ref } = useLayoutEffects<HTMLDivElement>({ debounce: true }, function* (div, effect) {
    yield three.initialize(div.firstElementChild as HTMLDivElement)
    effect.triggerRender()
    Object.assign(window, { three })
  }, [])

  useEffects(function* () {
    if (vertigo) {
      const controls = new VertigoControls(typeof vertigo === 'object' ? vertigo : {})
        .initialize(ref.current!)
        .start()

      yield controls.destroy

      yield onTick('three', tick => {
        controls.update(three.camera, three.aspect, tick.deltaTime)
      })
    }
  }, [vertigo])

  const layer = { position: 'absolute', inset: 0 } as CSSProperties
  return (
    <div ref={ref} className={className} style={layer}>
      <reactThreeContext.Provider value={three}>
        <div style={layer} />
        <div style={layer} className='thru'>
          {three.initialized && children}
        </div>
      </reactThreeContext.Provider>
    </div>
  )
}

export function ThreeProvider(...args: Parameters<typeof ServerProofThreeProvider>) {
  return useIsClient() && (
    <ServerProofThreeProvider {...args[0]} />
  )
}

