'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { ScalarType, Space } from 'some-utils-ts/experimental/layout/flex'

import s from './flexible-layout.module.css'

export function Client() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const root = new Space()
    root.parse(div.dataset.layout!)
    root.sizeX.set(div.clientWidth, ScalarType.Absolute)
    root.sizeY.set(div.clientHeight, ScalarType.Absolute)
    root.alignChildrenX = 0
    root.alignChildrenY = 0

    const queue = [{ element: div as HTMLElement, space: root }]
    while (queue.length > 0) {
      const node = queue.shift()!
      const children = ([...node.element.children] as HTMLElement[]).filter(child => !!child.dataset.layout)
      for (let i = 0; i < children.length; i++) {
        const element = children[i]
        const space = new Space()
        space.parse(element.dataset.layout!)
        space.userData.element = element
        node.space.add(space)
        queue.push({ element, space })
      }
    }

    root.computeLayout()

    for (const space of root.allDescendants({ includeSelf: false })) {
      const element = space.userData.element as HTMLElement
      const rect = space.rect
      element.style.position = 'absolute'
      element.style.left = `${rect.x}px`
      element.style.top = `${rect.y}px`
      element.style.width = `${rect.width}px`
      element.style.height = `${rect.height}px`
    }

    Object.assign(window, { root })
  }, [])

  return (
    <div ref={ref} className={`${s.FlexibleLayout} layer`} data-layout='vertical'>
      <div data-layout='horizontal size(1sh)'>
        <div data-layout='size(200,100%)'>
          <div className={s.Container}>
            <h1>Panel - 0</h1>
          </div>
        </div>

        <div data-layout='size(1sh)' />
        <div data-layout='size(320, 100%)'>
          <div className={s.Container}>
            <h1>Panel - 1</h1>
          </div>
        </div>
      </div>

      <div data-layout='size(1sh, 200)'>
        <div className={s.Container}>
          <h1>Timeline or asset panel</h1>
          <ul>
            <li>Todo:</li>
            <li>Create a draggable UI!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
