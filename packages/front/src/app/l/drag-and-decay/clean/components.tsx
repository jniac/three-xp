import { HTMLAttributes } from 'react'

export function Section({
  children,
  size = '70vh',
  textColor = 'white',
  bgColor = 'red',
  className = '',
}: { size?: string, textColor?: string, bgColor?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={`relative flex flex-col rounded-xl p-8 ${className}`}
      style={{ height: size, color: textColor, backgroundColor: bgColor }}
    >
      <SectionChip borderColor={bgColor} />
      <SectionChip borderColor={bgColor} right />
      {children}
    </section>
  )
}

export function SectionChip({ borderColor = 'white', right = false }: { borderColor?: string, right?: boolean }) {
  return (
    <div
      style={{
        '--size': '24px',
        position: 'absolute',
        top: 'calc((100% - var(--size)) / 2)',
        left: right ? '' : 'calc(var(--size) / -2)',
        right: right ? 'calc(var(--size) / -2)' : '',
        width: 'var(--size)',
        height: 'var(--size)',
        backgroundColor: 'currentColor',
        borderRadius: '50%',
        border: `8px solid ${borderColor}`,
      } as React.CSSProperties}>
    </div>
  )
}
