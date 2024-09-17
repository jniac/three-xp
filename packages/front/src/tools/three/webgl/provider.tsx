'use client'

import { createContext, ReactNode, useContext, useMemo } from 'react'

import { useEffects, UseEffectsCallback, UseEffectsDeps } from 'some-utils-react/hooks/effects'

import { useIsClient } from '@/utils/is-client'
import { createThree, Three } from './three'

const context = createContext<Three>(null!)

export function useThree(
  effectsGenerator?: UseEffectsCallback<Three>,
  deps?: UseEffectsDeps,
) {
  const three = useContext(context)

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

export function UseThree({ fn }: { fn: UseEffectsCallback<Three> }) {
  useThree(fn, 'always')
  return null
}

function __BasicThreeProvider({ children }: { children?: ReactNode }) {
  const three = useMemo(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const three = createThree({ width, height })
    return three
  }, [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    yield* three.init(div)
    Object.assign(window, { three })
  }, [])

  return (
    <context.Provider value={three} >
      <div className='absolute-through'>
        <div
          ref={ref}
          className='absolute-through'
        />
        <div className='absolute-through' >
          {children}
        </div>
      </div>
    </context.Provider>
  )
}

export function BasicThreeProvider({ children }: { children?: ReactNode }) {
  return useIsClient() && (
    <__BasicThreeProvider>
      {children}
    </__BasicThreeProvider>
  )
}
