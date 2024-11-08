
// @ts-ignore
const development = process.env.NODE_ENV === 'development'

const assetsPath = development
  ? '/assets/'
  : '/three-xp/assets/'

export const config = {
  development,
  assetsPath,
  assets: (url = '') => `${assetsPath}${url}`,
}
