
import { JSX } from 'react/jsx-runtime'

export function Spacer({ expand }: { expand: true }): JSX.Element
export function Spacer({ size }: { size: string | number }): JSX.Element
export function Spacer(props: { expand?: true; size?: string | number }) {
  if (props.expand)
    return <div style={{ flex: 1 }} />

  let { size = '1em' } = props
  if (typeof size === 'number')
    size = `${size}px`

  return (
    <div style={{ width: size, height: size, flexBasis: size }} />
  )
}
