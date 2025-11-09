'use client'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
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

function TickerWidget({ name = 'default', ticker: tickerProps = {} as Partial<typeof Ticker.defaultProps> }) {
  const ticker = Ticker.get(name).set(tickerProps)

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
        f: {Ticker.get(name).frame}
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

export function ClientPage() {
  useEffects(function* () {
    yield handleAnyUserInteraction(() => {
      Ticker.get('AnyUserInteraction').requestActivation()
    })
  }, [])
  return (
    <div className='layer thru p-16'>
      <h1 className='text-4xl font-bold'>
        Ticker - Basic
      </h1>
      <p className='mt-4 max-w-md'>
        A simple demonstration of the Ticker utility for managing time-based updates in applications.
      </p>

      <div className='flex flex-row flex-wrap items-start gap-4 mt-8'>
        <TickerWidget name='default' />
        <TickerWidget name='short' ticker={{ inactivityWaitDuration: 2, inactivityFadeDuration: 1 }} />
        <TickerWidget name='Infinity!' ticker={{ inactivityWaitDuration: Infinity }} />
        <TickerWidget name='AnyUserInteraction' />
      </div>
    </div>
  )
}
