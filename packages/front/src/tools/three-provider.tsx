'use client'

import { createContext, HTMLAttributes, useContext, useMemo } from 'react'
import * as THREE from 'three'
import { Group } from 'three'

import { useEffects, UseEffectsCallback, UseEffectsDeps, UseEffectsEffect, UseEffectsReturnable } from 'some-utils-react/hooks/effects'
import { ThreeWebglContext } from 'some-utils-three/contexts/webgl'

import { config } from '@/config'
import { useIsClient } from '@/utils/is-client'

const reactThreeContext = createContext<ThreeWebglContext>(null!)

export function useThree(
  effects?: UseEffectsCallback<ThreeWebglContext>,
  deps?: UseEffectsDeps,
): ThreeWebglContext {
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
  effects?: (group: Group, three: ThreeWebglContext, state: UseEffectsEffect) => UseEffectsReturnable,
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

/**
 * NOTE: Not tested!
 */
export function useThreeInstance<T>(
  _class: new () => (T extends THREE.Object3D ? T : never),
  effects?: (instance: T, three: ThreeWebglContext, state: UseEffectsEffect) => UseEffectsReturnable,
  deps?: UseEffectsDeps,
): T {
  const instance = useMemo(() => new _class(), [_class])

  useThree(async function* (three, state) {
    three.scene.add(instance)
    yield () => {
      instance.clear()
      instance.removeFromParent()
    }

    if (effects) {
      const it = effects(instance, three, state)
      if (it && typeof it.next === 'function') {
        do {
          const { value, done } = await it.next()
          if (done) break
          yield value
        } while (state.mounted)
      }
    }
  }, deps)

  return instance
}

function ServerProofThreeProvider({ children, className }: HTMLAttributes<HTMLDivElement>) {
  const three = useMemo(() => new ThreeWebglContext(), [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    // Set path for assets, it is very dependent on the environment
    const path = config.development ? '/assets/' : '/three-xp/assets/'
    three.loader.setPath(path)

    yield three.initialize(div)
    Object.assign(window, { three, THREE })
  }, [])

  return (
    <div ref={ref} className={`ThreeProvider absolute-through ${className ?? ''}`}>
      <reactThreeContext.Provider value={three}>
        {children}
      </reactThreeContext.Provider>
    </div>
  )
}

export function ThreeProvider(props: HTMLAttributes<HTMLDivElement>) {
  return useIsClient() && <ServerProofThreeProvider {...props} />
}

