import IconCopySvg from '@/components/svg/icon-copy.svg'

import s from './IconButton.module.css'

export function IconButton(props: Partial<{ label: string }> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const {
    label,
    className,
    children = <IconCopySvg />,
  } = props
  return (
    <button
      className={`${s.IconButton} ${className}`}
      {...props}
    >
      {label && (
        <span className={s.Label}>
          {label}
        </span>
      )}
      {children}
    </button>
  )
}
