'use client'

import { createContext, useContext, useMemo } from 'react'
import { handleSize } from 'some-utils-dom/handle/size'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { ObservableNumber } from 'some-utils-ts/observables'

import { useResponsive } from '../responsive'

const settings = {
  bottomWeights: {
    default: {
      left: 5,
      right: 3,
    },
    almostSquareAspect: {
      maxAspect: 4 / 3,
      left: 1,
      right: 1,
    },
  },
}

class AboutLayout {
  changeObs = new ObservableNumber(0)
  root = new Space({ direction: 'vertical' }).add(
    new Space('header', {
      size: ['1rel', 64]
    }),
    new Space({
      size: ['1rel', 2]
    }),
    new Space('bottom', {
      size: ['1rel', '1fr']
    }).add(
      new Space('left', {
        size: [`${settings.bottomWeights.default.left}fr`, '1rel']
      }),
      new Space('right', {
        size: [`${settings.bottomWeights.default.right}fr`, '1rel']
      }),
    ),
  )

  header = this.root.find('header')!
  bottom = this.root.find('bottom')!
  left = this.root.find('left')!
  right = this.root.find('right')!

  get isReady() { return this.changeObs.value > 0 }
}

const context = createContext<AboutLayout>(null!)

export function useAboutLayout() {
  return useContext(context)
}

export function AboutLayoutProvider({ children }: { children?: React.ReactNode }) {
  const responsive = useResponsive()
  const aboutLayout = useMemo(() => new AboutLayout(), [])
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const parent = div.parentElement as HTMLElement
    yield handleSize(parent, {
      onSize: info => {
        aboutLayout.root.setSize(info.size.x, info.size.y)
        aboutLayout.right.enabled = responsive.layoutObs.value.screenSize !== 'mobile'

        const aspect = info.size.x / info.size.y
        const { bottomWeights } = settings
        const currentBottomWeights = aspect < bottomWeights.almostSquareAspect.maxAspect
          ? bottomWeights.almostSquareAspect
          : bottomWeights.default

        const [left, right] = aboutLayout.bottom.children
        left.setWidth(`${currentBottomWeights.left}fr`)
        right.setWidth(`${currentBottomWeights.right}fr`)

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
