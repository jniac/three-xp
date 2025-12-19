import { Space } from 'some-utils-ts/experimental/layout/flex'

import { colors } from '../../../shared/colors'
import { CanvasBlock } from '../../../shared/flex-layout-demo'
import { layoutColorRule } from './shared'

export function D6() {
  return (
    <CanvasBlock
      title={<h2>(D6) Aspect</h2>}
      description={(
        <>Nested <span style={{ color: colors.paleGreen }}>"fit-children"</span>, <span style={{ color: colors.blue }}>"fraction"</span>, <span style={{ color: colors.magenta }}>"absolute"</span> spaces demo</>
      )}
      size={[800, 600]}
      root={[
        new Space({
          offset: [100, 100],
          size: [600, 400],
          spacing: 10,
          // direction: 'vertical',
        })
          .add(
            new Space({ aspect: 1 / 8 }),
            new Space({ aspect: 1 / 2 }),
            new Space({ aspect: 1 / 8 }),
            new Space({ sizeY: '50%', aspect: 1 }),
          )
      ]}
      colorRule={layoutColorRule}
      drawDirection
      computeLayout={root => root.computeLayout2()}
      tickDisabled
      onTick={(roots, tick) => {
        for (const root of roots) {
          root.set({ alignChildren: tick.sin01Time({ frequency: 1 / 3 }) })
        }
      }}
    />
  )
}
