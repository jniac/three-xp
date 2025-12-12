import { Space } from 'some-utils-ts/experimental/layout/flex'
import { easing } from 'some-utils-ts/math/easing'

import { colors } from '../../../shared/colors'
import { CanvasBlock } from '../../../shared/flex-layout-demo'

export function D3() {
  return (
    <CanvasBlock
      title={<h2>Nested</h2>}
      description={(
        <>Nested <span style={{ color: colors.magenta }}>"fit-children"</span>, alignChildren and alignSelf demo</>
      )}
      size={[800, 200]}
      root={[
        new Space({
          offset: [10, 10],
          size: 'fit-children',
          spacing: 10,
          alignChildrenY: .5,
        })
          .add(
            new Space({
              size: 'fit-children',
              spacing: 10
            })
              .populate(2, { size: 100 })
          )
          .populate(3, { size: [20, 60] })
          .add(
            new Space({
              size: 'fit-children',
              direction: 'vertical',
              spacing: 10,
            })
              .populate(2, { size: [100, 65] })
          ),

        new Space({
          offset: [620, 10],
          size: 'fit-children',
          direction: 'vertical',
          spacing: 10,
          alignChildrenX: .5,
        })
          .add(
            new Space({
              size: 'fit-children',
              direction: 'vertical',
              spacing: 10
            })
              .populate(2, { size: [100, 20] })
          )
          .populate(3, { size: [60, 20] }),
      ]}
      computeLayout={root => root.computeLayout2()}
      colorRule={space => {
        if (space.isRoot())
          return colors.yellow
        if (space.sizeXFitChildren || space.sizeYFitChildren)
          return colors.magenta
        return colors.blue
      }}
      onTick={(roots, tick) => {
        for (const root of roots) {
          root.set({ alignChildren: tick.sin01Time({ frequency: 1 / 3 }) })
          root.get(3)?.set({ alignSelf: easing.transition.inOut5(tick.sin01Time({ frequency: 1 / 3 })) })
        }
      }} />
  )
}
