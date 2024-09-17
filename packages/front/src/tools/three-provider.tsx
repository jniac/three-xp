'use client'

import { createContext, HTMLAttributes, useContext, useMemo } from 'react'
import * as THREE from 'three'

import { useEffects, UseEffectsCallback, UseEffectsDeps } from 'some-utils-react/hooks/effects'
import { ThreeWebglContext } from 'some-utils-three/contexts/webgl'

import { useIsClient } from '@/utils/is-client'

const reactThreeContext = createContext<ThreeWebglContext>(null!)

export function useThree(
  effectsGenerator?: UseEffectsCallback<ThreeWebglContext>,
  deps?: UseEffectsDeps,
) {
  const three = useContext(reactThreeContext)

  useEffects(async function* (_, state) {
    if (effectsGenerator) {
      const it = effectsGenerator(three, state)
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

function Inner({ children, className }: HTMLAttributes<HTMLDivElement>) {
  const three = useMemo(() => new ThreeWebglContext(), [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    yield three.init(div)
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
  return useIsClient() && <Inner {...props} />
}

