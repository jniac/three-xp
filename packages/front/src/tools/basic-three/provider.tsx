'use client'

import { createContext, ReactNode, useContext, useMemo } from 'react'

import { useEffects, UseEffectsYieldable } from 'some-utils-react/hooks/effects'

import { useIsClient } from '@/utils/is-client'
import { createThree, Three } from './three'

const context = createContext<Three>(null!)

type EffectsGenerator = (three: Three) => Generator<UseEffectsYieldable> | AsyncGenerator<UseEffectsYieldable>

export function useThree(
  effectsGenerator?: EffectsGenerator,
  deps?: unknown[],
) {
  const three = useContext(context)

  useEffects(async function* () {
    if (effectsGenerator) {
      for await (const effect of effectsGenerator(three)) {
        yield effect
      }
    }
  }, deps ?? [])

  return three
}

export function UseThree({ fn }: { fn: EffectsGenerator }) {
  useThree(fn)
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
      <div className='wraps'>
        <div
          ref={ref}
          className='wraps'
        />
        <div className='wraps' >
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
