'use client'

import { useObservableValue } from 'some-utils-react/hooks/observables'

import { useResponsive } from '../responsive'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  mobile?: React.HTMLAttributes<HTMLDivElement>
  desktop?: React.HTMLAttributes<HTMLDivElement>
  tablet?: React.HTMLAttributes<HTMLDivElement>
}

const supportedOverrides = new Set(['className', 'style'])

/**
 * RDiv stands for "Responsive Div".
 * 
 * It is a wrapper around a standard div that allows overriding certain props 
 * based on the current screen size (mobile, desktop, tablet).
 * 
 * Eg:
 * ```tsx
 * <RDiv
 *   className='p-8'
 *   mobile={{ className: 'p-4' }}
 * >
 *   Content
 * </RDiv>
 * ```
 */
export function RDiv(props: Props) {
  const { mobile, desktop, tablet, ...rest } = props
  const responsive = useResponsive()
  const layout = useObservableValue(responsive.layoutObs)
  const finalProps = { ...rest }
  const override = { mobile, desktop, tablet }[layout.screenSize]
  if (override) {
    for (const key of Object.keys(override)) {
      if (supportedOverrides.has(key) === false) {
        console.warn(`RDiv does not support overriding '${key}' (for the moment?)`)
        continue
      }

      switch (key) {
        case 'className':
          const sourceTokens = new Set(rest.className?.split(/\s+/) ?? [])
          const overrideTokens = new Set(override.className?.split(/\s+/) ?? [])
          for (const overrideToken of overrideTokens) {
            if (overrideToken.startsWith('p-')) {
              for (const sourceToken of sourceTokens) {
                if (sourceToken.startsWith('p-')) {
                  sourceTokens.delete(sourceToken)
                }
              }
            }
          }
          finalProps.className = [...sourceTokens, ...overrideTokens].join(' ')
          break

        case 'style': {
          finalProps.style = { ...finalProps.style, ...override.style }
          break
        }
      }
    }
  }
  return (
    <div {...finalProps} />
  )
}
