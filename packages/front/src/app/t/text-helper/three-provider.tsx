'use client'

import { createContext, HTMLAttributes, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { Group, Mesh, Object3D } from 'three'

import { useEffects, UseEffectsCallback, UseEffectsDeps, UseEffectsEffect, UseEffectsReturnable, useLayoutEffects, } from 'some-utils-react/hooks/effects'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'
import { applyTransform, TransformProps } from 'some-utils-three/utils/transform'

const reactThreeContext = createContext<ThreeWebGLContext>(null!)

export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export function useThree(
  effects?: UseEffectsCallback<ThreeWebGLContext>,
  deps?: UseEffectsDeps,
): ThreeWebGLContext {
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
  effects?: (group: Group, three: ThreeWebGLContext, state: UseEffectsEffect) => UseEffectsReturnable,
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
  _class: new () => (T extends Object3D ? T : never),
  effects?: (instance: T, three: ThreeWebGLContext, state: UseEffectsEffect) => UseEffectsReturnable,
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



type ThreeInstanceProps<T extends Object3D> = TransformProps & {
  type: new () => T
}

/**
 * Will create an instance of the given type and apply the given transform props.
 * If the instance has a `threeInit` method, it will be called with the three context.
 */
export function ThreeInstance<T extends Object3D>(props: ThreeInstanceProps<T>) {
  useThree(function* (three) {
    const { type, ...rest } = props
    const instance = new type()
    applyTransform(instance, rest)
    three.scene.add(instance)
    if ('threeInit' in instance) {
      yield* (instance as any).threeInit(three)
    }
    yield () => {
      instance.traverse(child => {
        if (child instanceof Mesh) {
          child.geometry.dispose()
          child.material.dispose()
        }

        if ('destroy' in child) {
          (child as any).destroy()
        }
      })
      instance.clear()
      instance.removeFromParent()
    }
  }, [])

  return null
}



const defaultProps = {
  className: '',
  assetsPath: '/',
}

type Props = HTMLAttributes<HTMLDivElement> & Partial<typeof defaultProps>

function ServerProofThreeProvider(props: Props) {
  const { children, className, assetsPath } = { ...defaultProps, ...props }

  const three = useMemo(() => new ThreeWebGLContext(), [])
  three.loader.setPath(assetsPath)


  const { ref } = useLayoutEffects<HTMLDivElement>({ debounce: true }, function* (div, effect) {
    yield three.initialize(div.firstElementChild as HTMLDivElement)
    effect.triggerRender()
    Object.assign(window, { three })
  }, [])

  return (
    <div ref={ref} className={className} style={{ position: 'absolute', inset: 0 }}>
      <reactThreeContext.Provider value={three}>
        <div style={{ position: 'absolute', inset: '0' }} />
        <div style={{ position: 'absolute', inset: '0' }} className='thru'>
          {three.initialized && children}
        </div>
      </reactThreeContext.Provider>
    </div>
  )
}

export function ThreeProvider(props: Props) {
  return useIsClient() && <ServerProofThreeProvider {...props} />
}

