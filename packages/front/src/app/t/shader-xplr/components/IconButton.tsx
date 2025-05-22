import IconCopySvg from '@/components/svg/icon-copy.svg'

import s from './IconButton.module.css'

export function IconButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const {
    className,
    children = <IconCopySvg />,
  } = props
  return (
    <button
      className={`${s.IconButton} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
