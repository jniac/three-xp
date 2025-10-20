'use client'

import { createContext, useContext, useMemo } from 'react'
import { handleSize } from 'some-utils-dom/handle/size'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { ObservableNumber } from 'some-utils-ts/observables'

class AboutLayout {
  changeObs = new ObservableNumber(0)
  root = new Space({ direction: 'vertical' }).add(
    new Space({ name: 'header', size: ['1rel', 64] }),
    new Space({ size: ['1rel', 2] }),
    new Space({ name: 'bottom', size: ['1rel', '1fr'] }).add(
      new Space({ name: 'left', size: ['1fr', '1rel'] }),
      new Space({ size: [2, '1rel'] }),
      new Space({ size: ['1fr', '1rel'] }),
    ),
  )
  header = this.root.find('header')!
  left = this.root.find('left')!
  get isReady() { return this.changeObs.value > 0 }
}

const context = createContext<AboutLayout>(null!)

export function useAboutLayout() {
  return useContext(context)
}

export function AboutLayoutProvider({ children }: { children?: React.ReactNode }) {
  const aboutLayout = useMemo(() => new AboutLayout(), [])
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const parent = div.parentElement as HTMLElement
    yield handleSize(parent, {
      onSize: info => {
        aboutLayout.root.setSize(info.size.x, info.size.y)
        aboutLayout.root.computeLayout()
        aboutLayout.changeObs.value++
        window.requestAnimationFrame(() => {
          // because camera update after this
          aboutLayout.changeObs.value++
        })
      },
    })
  }, [])
  return (
    <context.Provider value={aboutLayout}>
      <div ref={ref} style={{ display: 'none' }} />
      {children}
    </context.Provider>
  )
}
