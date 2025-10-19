import { Spacer } from '../atoms/spacer'

const defaultColors = {
  diamondTop: '#6060FF',
  diamondSides: '#3D3DE9',
  diamondBottom: '#2500AD',
  text: '#2500AD',
}

export function Diamond({ colors = defaultColors }) {
  return (
    <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <mask id="circleMask">
          <rect width="32" height="32" fill="black" />
          <circle cx="16" cy="16" r="16" fill="white" />
        </mask>
      </defs>

      <g mask="url(#circleMask)">
        <rect width="32" height="32" fill={colors.diamondSides} />
        <path d="M16 16L0 0H0L32 0Z" fill={colors.diamondTop} />
        <path d="M16 16L32 0V32L32 32Z" fill={colors.diamondSides} />
        <path d="M16 16L0 0V32L0 32Z" fill={colors.diamondSides} />
        <path d="M16 16L32 32H0L32 0Z" fill={colors.diamondBottom} />
      </g>
    </svg>
  )
}

export function Logo({ colors = defaultColors }) {
  return (
    <div className='flex flex-row items-center'>
      <Diamond colors={colors} />
      <Spacer size='10px' />
      <div style={{ color: colors.text }}>
        Joseph M.
      </div>
    </div>
  )
}
