
'use client'

import { Space } from 'some-utils-ts/experimental/layout/flex'

import { CanvasBlock } from '../../shared/flex-layout-demo'
import { computeLayout2 } from '../flex-algo/computeLayout-2'

import '../../shared/flex-layout-demo.css'

export function PageClient() {
  return (
    <div className='FlexLayoutDemo p-16 h-screen overflow-auto'>
      <h1 className='text-3xl text-center font-bold'>
        Aspect Size Mode Demo
      </h1>

      <CanvasBlock
        root={
          new Space({
            offset: [100, 100],
            size: [600, 400],
            padding: 10,
            gap: 10,
          })
            .populate(3, { aspect: 1 })
        }
        title={<h2><pre>childrenAspectSizeMode: undefined</pre> (default)</h2>}
      />

      <CanvasBlock
        root={() => {
          const root = new Space({
            offset: [100, 100],
            size: [600, 400],
            spacing: 10,
          })
            .populate(4)
          for (const column of root.children.slice(0, 3)) {
            column.set({ spacing: 10 })
            column.add(
              new Space({ aspect: 1 }),
              new Space({ aspect: 1 }),
              new Space({ aspect: 1 }),
              new Space({ aspect: 1 }),
            )
          }
          root.children.at(3)?.set({
            sizeY: 'fit-content',
            spacing: 10,
          })
            .add(
              new Space({ size: 40 }),
              new Space({ size: 40 }),
            )

          return root
        }}
        computeLayout={r => computeLayout2(r)}
        title={<h2><pre>childrenAspectSizeMode: undefined</pre> (default)</h2>}
      />

      <CanvasBlock
        root={
          new Space({
            offset: [100, 100],
            size: [600, 400],
            padding: 10,
            gap: 10,
            childrenAspectSizeMode: 'fill-normal-space',
          })
            .populate(3, { aspect: 1 })
        }
        title={<h2><pre>childrenAspectSizeMode: "fill-normal-space"</pre></h2>}
      />

      <CanvasBlock
        root={
          new Space({
            offset: [100, 100],
            size: [600, 400],
            padding: 10,
            gap: 10,
            childrenAspectSizeMode: 'fill-tangent-space',
          })
            .populate(3, { aspect: 1 })
        }
        computeLayout={r => computeLayout2(r)}
        title={<h2><pre>childrenAspectSizeMode: "fill-tangent-space"</pre></h2>}
      />

      <CanvasBlock
        root={
          new Space({
            offset: [100, 100],
            size: [600, 400],
            padding: 10,
            gap: 10,
            childrenAspectSizeMode: 'fill-tangent-space',
          })
            .add(
              new Space({ aspect: 1 }),
              new Space({ aspect: 1, sizeX: '2fr' }),
              new Space({ aspect: 1 }),
            )
        }
        title={
          <>
            <h2>
              <pre>
                "fill-tangent-space"
              </pre>
            </h2>
            <div>
              <strong className='warning'>⚠️ Expect breaking changes in future versions</strong>
            </div>
            <div>
              <h3>
                ❌ Edge case: The middle child has sizeX="2fr"
              </h3>
              <ul className='pl-8 list-disc'>
                <li>
                  ✅ Other proportions are ok
                </li>
                <li>
                  ⚠️ but overflow occurs in X direction.
                </li>
              </ul>
            </div>
          </>
        }
      />

      <CanvasBlock
        root={
          new Space({
            offset: [100, 100],
            size: [600, 400],
            padding: 10,
            gap: 10,
            childrenAspectSizeMode: 'fill-tangent-space',
          })
            .add(
              new Space({ aspect: 1 }),
              new Space({ aspect: 1 }),
              new Space({ aspect: 1, selfAspectSizeMode: 'fill-normal-space' }),
            )
        }
        title={
          <>
            <h2>
              <pre>"fill-tangent-space"</pre>
            </h2>
            <div>
              <strong className='warning'>⚠️ Expect breaking changes in future versions</strong>
            </div>
            <div>
              <h3>
                ❌ Edge case: The last child has <pre>selfAspectSizeMode="fill-normal-space"</pre>
              </h3>
              <ul className='pl-8 list-disc'>
                <li>
                  ✅ Other proportions are ok
                </li>
                <li>
                  ⚠️ but overflow occurs in X direction.
                </li>
              </ul>
            </div>
          </>
        }
      />
    </div>
  )
}