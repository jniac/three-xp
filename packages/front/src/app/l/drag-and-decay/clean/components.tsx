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
      {children}
    </section>
  )
}

export function SectionChip({ borderColor = 'white' }: { borderColor?: string }) {
  return (
    <div
      style={{
        '--size': '1.2rem',
        position: 'absolute',
        top: 'calc((100% - var(--size)) / 2)',
        left: 'calc(var(--size) / -2)',
        width: 'var(--size)',
        height: 'var(--size)',
        backgroundColor: 'currentColor',
        borderRadius: '50%',
        border: `4px solid ${borderColor}`,
      } as React.CSSProperties}>
    </div>
  )
}
