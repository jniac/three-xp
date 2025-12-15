import { Direction, ScalarType, Space } from 'some-utils-ts/experimental/layout/flex'

import { colors } from '../../../shared/colors'

/**
 * Colors for layout spaces based on their properties
 */
export function layoutColorRule(space: Space): string {
  if (space.isRoot())
    return colors.yellow
  const h = space.parent?.direction !== Direction.Horizontal

  const dir_type = h ? space.sizeY.type : space.sizeX.type

  const fit = space.direction === Direction.Horizontal ? space.sizeXFitChildren : space.sizeYFitChildren
  if (fit)
    return colors.paleGreen

  const fr = dir_type === ScalarType.Fraction || dir_type === ScalarType.Auto
  if (fr)
    return colors.blue

  return colors.magenta
}
