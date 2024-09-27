import { HTMLAttributes, useRef } from 'react'

import IconCopySvg from '@/components/svg/icon-copy.svg'

import { IconButton } from './IconButton'

import s from './Copyable.module.css'

type Props = HTMLAttributes<HTMLDivElement> & Partial<{
  contentToCopy: string
}>

export function Copyable(props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const copy = () => {
    const str = ref.current!.firstChild!.textContent!
    navigator.clipboard.writeText(str)
  }
  return (
    <div ref={ref} className={s.Copyable}>
      <div>
        {props.children}
      </div>
      <div className={`${s.Overlay} layer thru p-2`}>
        <IconButton onClick={copy}>
          <IconCopySvg />
        </IconButton>
      </div>
    </div>
  )
}