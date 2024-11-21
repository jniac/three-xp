'use client'

import { Color, Group, IcosahedronGeometry, Mesh, Vector3 } from 'three'

import { ToolType } from 'some-three-editor/editor-context'
import { hierarchyDeployDownTo } from 'some-three-editor/editor-context/actions'
import { ThreeAndEditorProvider, useEditor, useThree } from 'some-three-editor/editor-provider'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick, Tick } from 'some-utils-ts/ticker'

class TranslatePlusScale extends Group {
  parts = {
    sphere: setup(new Mesh(new IcosahedronGeometry(1, 8), new AutoLitMaterial()), {
      name: 'sphere',
      parent: this,
    }),
    circle: setup(new LineHelper()
      .circle({ radius: .5 })
      .circle({ radius: 1 })
      .circle({ radius: 1.5 })
      .draw()
      , {
        name: 'circle',
        parent: this,
      }),
    pivot: setup(new Group(), {
      name: 'pivot',
      parent: this,
    }),
    position: setup(new Group(), {
      name: 'position',
      parent: this,
    }),
    grid: setup(new SimpleGridHelper(), {
      name: 'grid',
      parent: this,
      rotationX: '90deg',
    }),
  }

  onTick(tick: Tick) {
    const { sphere, pivot, position } = this.parts

    const scale = tick.lerpSin01Time(.5, 1.5, { frequency: 1 / 5 })
    const translate = new Vector3()
      .copy(pivot.position)
      .addScaledVector(pivot.position, -scale)

    sphere.matrixAutoUpdate = false
    sphere.matrix
      .makeScale(scale, scale, scale)
      .setPosition(translate.add(position.position))
  }
}

function TranslatePlusScaleComponent() {
  const editor = useEditor()
  useThree(function* (three) {
    three.scene.background = new Color('#345')

    const scene = new TranslatePlusScale()
    three.scene.add(scene)

    yield onTick('three', tick => scene.onTick(tick))

    editor.sceneSelection.set("Hop!", [scene.parts.pivot])
    editor.toolType.set(ToolType.Move)
    hierarchyDeployDownTo(editor, scene.parts.pivot)

    yield () => scene.removeFromParent()
  }, [])

  return null
}

export function Main() {
  return (
    <ThreeAndEditorProvider>
      <TranslatePlusScaleComponent />
      <div className='flex flex-col p-4 gap-2'>
        <p>
          Pivot offset to perform translate and scale is quite straightforward:
        </p>
        <pre className='bg-[#fff1] rounded px-2 py-1'>
          {`
const scale = ... // some value
const translate = new Vector3()
  .copy(pivot.position)
  .addScaledVector(pivot.position, -scale)

matrix
  .makeScale(scale, scale, scale)
  .setPosition(translate)
`.trim()}
        </pre>
      </div>

    </ThreeAndEditorProvider>
  )
}
