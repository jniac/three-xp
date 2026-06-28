'use client'

import { useState } from 'react'
import { HierarchyView } from 'some-utils-misc/hierarchy'
import { useThree } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Message } from 'some-utils-ts/message'
import { wait } from 'some-utils-ts/misc/async'
import { dumpDestroyables } from 'some-utils-ts/misc/destroy'
import { ObservableSet } from 'some-utils-ts/observables'
import { onTick } from 'some-utils-ts/ticker'
import { Destroyable } from 'some-utils-ts/types'
import { Object3D } from 'three'
import { createObject3DInspector } from './editor-infer'


export class SelectionHandler<T extends object = any> {
  #private = {
    destroyed: false,
    selection: new ObservableSet<T>(),
    destroyables: [] as Destroyable[],
  }

  constructor() {
    this.#private.destroyables.push(
      Message.on<T>('SELECTION', 'REQUEST:SELECT', message => {
        const payload = message.assertPayload('SELECTION/REQUEST:SELECT must have a payload')
        this.select(payload)
        message.response = { success: true }
      }),
      Message.on<T>('SELECTION', 'REQUEST:DESLECT', message => {
        const payload = message.assertPayload('SELECTION/REQUEST:DESLECT must have a payload')
        this.deselect(payload)
        message.response = { success: true }
      }),
      Message.on<T>('SELECTION', 'REQUEST:SET_SELECTION', message => {
        const payload = message.assertPayload('SELECTION/REQUEST:SET_SELECTION must have a payload')
        this.setSelection(payload)
        message.response = { success: true }
      }),
      this.#private.selection.onChange(() => {
        console.log('Selection changed:', this.#private.selection.get())
        Message.send('SELECTION', 'CHANGE', {
          payload: this.#private.selection.get(),
        })
      }),
    )
  }

  destroy = () => {
    if (this.#private.destroyed)
      return

    this.#private.destroyed = true
    this.#private.selection.clear()
    dumpDestroyables(this.#private.destroyables)
  }

  select(arg: T | T[]) {
    const objects = Array.isArray(arg) ? arg : [arg]
    this.#private.selection.add(...objects)
  }

  deselect(arg: T | T[]) {
    const objects = Array.isArray(arg) ? arg : [arg]
    this.#private.selection.remove(...objects)
  }

  setSelection(arg: T | T[]) {
    const objects = Array.isArray(arg) ? arg : [arg]
    this.#private.selection.set(objects)
  }
}

function getName(object: any) {
  const { name } = object
  const type = object.constructor.name
  return name
    ? `${name} {${type}}`
    : `{${type}}`
}

export function InspectorComponent() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const h1 = div.querySelector('h1')!
    const content = div.querySelector('div')!

    yield Message.on<Set<any>>('SELECTION', 'CHANGE', message => {
      const selection = message.assertPayload('SELECTION/CHANGE must have a payload')
      h1.textContent = selection.size === 0
        ? 'No selection'
        : selection.size === 1
          ? getName(Array.from(selection)[0])
          : `${selection.size} items selected`

      content.innerHTML = ''

      if (selection.size === 1) {
        const object = Array.from(selection)[0]
        if (object instanceof Object3D) {
          createObject3DInspector(object, content)
        }
      }
    })
  }, [])
  return (
    <div className='w-[300px]' ref={ref}>
      <h1>
        No selection
      </h1>
      <div />
    </div>
  )
}

export function HierarchyComponent() {
  const [_, setTick] = useState(0)
  const invalidate = () => setTick(tick => tick + 1)

  const three = useThree()
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    await wait('nextFrame')
    const hierachy = new HierarchyView(three.scene, {
      onSelectionChange(nodes) {
        Message.send('SELECTION', 'REQUEST:SET_SELECTION', {
          payload: nodes,
        })
      },
    })
    yield hierachy
    div.appendChild(hierachy.div)
    const hash = hierachy.computeHash()
    yield onTick('three', { timeInterval: 1 }, () => {
      const newHash = hierachy.computeHash()
      if (newHash !== hash) {
        invalidate()
      }
    })
  }, 'always')

  return (
    <div ref={ref} />
  )
}