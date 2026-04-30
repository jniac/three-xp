import { Space } from 'some-utils-ts/experimental/layout/flex'

import { colors } from '../../../shared/colors'
import { CanvasBlock } from '../../../shared/flex-layout-demo'
import { computeLayout2 } from '../../flex-algo/computeLayout-2'
import { layoutColorRule } from './shared'

export function D5() {
  return (
    <CanvasBlock
      title={<h2>(D5) Nested fit/fr space</h2>}
      description={(
        <>Nested <span style={{ color: colors.paleGreen }}>"fit-children"</span>, <span style={{ color: colors.blue }}>"fraction"</span>, <span style={{ color: colors.magenta }}>"absolute"</span> spaces demo</>
      )}
      size={[800, 600]}
      root={[
        new Space({
          offset: [10, 10],
          size: [780, 580],
          spacing: 10,
          // direction: 'vertical',
        })
          .add(
            new Space({ size: [120, 240] }),
            new Space({ spacing: 10, alignChildren: 0 }).add(
              new Space({ size: ['fit-content', 240], spacing: 10, alignChildren: 0 }).add(
                new Space({ size: 40 }),
                new Space({ size: 40 }),
                new Space({ size: 80 }),
              ),
              new Space(),
            ),
            new Space({ size: [120, 240] }),
            new Space({ size: 'fit-content', spacing: 10, alignChildren: 1 }).add(
              new Space({ size: [50, 50] }),
              new Space({ size: [100, 100] }),
            )
          )
      ]}
      colorRule={layoutColorRule}
      drawDirection
      computeLayout={root => computeLayout2(root)}
      tickDisabled
      onTick={(roots, tick) => {
        for (const root of roots) {
          root.set({ alignChildren: tick.sin01Time({ frequency: 1 / 3 }) })
        }
      }}
    />
  )
}

export function D5_Vertical() {
  return (
    <CanvasBlock
      title={<h2>(D5_Vertical) Nested fit/fr space</h2>}
      description={(
        <>Nested <span style={{ color: colors.paleGreen }}>"fit-children"</span>, <span style={{ color: colors.blue }}>"fraction"</span>, <span style={{ color: colors.magenta }}>"absolute"</span> spaces demo</>
      )}
      size={[800, 600]}
      root={[
        new Space({
          offset: [10, 10],
          size: [780, 580],
          spacing: 10,
          // alignChildren: 0,
          direction: 'vertical',
        })
          .add(
            new Space({ size: [240, 60] }),
            new Space({ spacing: 10, direction: 'vertical' }).add(
              new Space({ size: [240, 'fit-content'], direction: 'vertical', spacing: 10, alignChildren: 0 }).add(
                new Space({ size: 40 }),
                new Space({ size: 40 }),
              ),
              new Space(),
            ),
            new Space({ size: [240, 60] }),
            new Space({ direction: 'vertical', size: 'fit-content', spacing: 10, alignChildrenY: 1 }).add(
              new Space({ size: [240, 60] }),
              new Space({ size: [100, 100] }),
            )
          )
      ]}
      colorRule={layoutColorRule}
      drawDirection
      computeLayout={root => computeLayout2(root)}
      tickDisabled
      onTick={(roots, tick) => {
        for (const root of roots) {
          root.set({ alignChildren: tick.sin01Time({ frequency: 1 / 3 }) })
        }
      }}
    />
  )
}
