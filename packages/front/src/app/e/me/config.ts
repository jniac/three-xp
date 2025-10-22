import { isHosted } from 'some-utils-ts/misc/is-hosted'

export const VERSION = '0.0.2'

export const assetPaths = isHosted()
  ? '/three-xp/assets'
  : '/assets'