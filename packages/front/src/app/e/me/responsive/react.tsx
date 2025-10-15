'use client'

import { createContext, useContext, useLayoutEffect, useMemo } from 'react'

import { Orientation, Responsive, ScreenSize } from './responsive'

const context = createContext(new Responsive())

export function useResponsive() {
  const responsive = useContext(context)

  if (!responsive) {
    throw new Error('useResponsive must be used within a ResponsiveProvider')
  }

  return responsive
}

export function ResponsiveProvider({ children }: { children?: React.ReactNode }) {
  const responsive = useMemo(() => new Responsive(), [])
  useLayoutEffect(() => {
    let frameId: number

    const update = () => {
      frameId = window.requestAnimationFrame(update)

      const { innerWidth: width, innerHeight: height } = window

      responsive.viewportObs.mutate({ width, height })
      responsive.layoutObs.mutate(responsive.viewportObs.value.computeLayout())

      document.documentElement.style.setProperty('--viewport-width', `${width}px`)
      document.documentElement.style.setProperty('--viewport-height', `${height}px`)

      for (const size of Object.values(ScreenSize))
        document.documentElement.classList.toggle(size, responsive.layoutObs.value.screenSize === size)

      for (const orientation of Object.values(Orientation))
        document.documentElement.classList.toggle(orientation, responsive.layoutObs.value.orientation === orientation)
    }

    update()

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  })
  return (
    <context.Provider value={responsive}>
      {children}
    </context.Provider>
  )
}
