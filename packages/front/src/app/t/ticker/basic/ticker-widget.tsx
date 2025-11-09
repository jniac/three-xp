'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Ticker } from 'some-utils-ts/ticker'

function ProgressBar({ name = 'default', progress = 0, className = '' }) {
  return (
    <div className={`${className} ProgressBar relative w-full h-5 bg-[#fff6] rounded-lg overflow-hidden`}>
      <div
        className='ProgressBarFill w-1/2 h-full bg-[white]'
        style={{ width: `${(progress * 100).toFixed(2)}%` }}
      />
      <div className='absolute inset-0 flex flex-row px-2 text-black text-xs items-center justify-between'>
        {name}
      </div>
    </div>
  )
}

function Button({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`text-xs border border-white/20 rounded px-2 py-1 hover:bg-white/10 ${className}`}
      {...props}
    />
  )
}

export function TickerWidget({
  name = null as string | null,
  ticker: tickerProps = {} as Partial<typeof Ticker.defaultProps>
}) {
  const ticker = name
    ? Ticker.get(name).set(tickerProps)
    : Ticker.current()

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const info = div.querySelector('.TickerInfo') as HTMLDivElement
    const inactivityProgressFill = div.querySelector('.InactivityProgress .ProgressBarFill') as HTMLDivElement
    const inactivityTimeScaleFill = div.querySelector('.InactivityTimeScale .ProgressBarFill') as HTMLDivElement
    yield ticker.onTick(tick => {
      info.textContent = `f: ${tick.frame} t: ${tick.time.toFixed(2)}s dt: ${tick.deltaTime.toFixed(4)}s`
      inactivityProgressFill.style.width = `${((tick.inactivityProgress) * 100).toFixed(2)}%`
      inactivityTimeScaleFill.style.width = `${((tick.inactivityTimeScale) * 100).toFixed(2)}%`
    })
  }, [])

  return (
    <div
      ref={ref}
      className='w-[280px] p-4 border border-white/20 rounded flex flex-col gap-2'
    >
      <h2>
        Ticker: {name}
      </h2>
      <div className='TickerInfo text-xs font-mono pre'>
        f: -- t: --s dt: --s
      </div>
      <ProgressBar className='InactivityProgress' name='Inactivity Progress' />
      <ProgressBar className='InactivityTimeScale' name='Inactivity TimeScale' />
      <Button
        onClick={() => {
          ticker.requestActivation()
        }}
      >
        Request Activation
      </Button>
    </div>
  )
}
