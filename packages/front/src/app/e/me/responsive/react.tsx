'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'

import { Orientation, PointerType, Responsive, ScreenSize } from './responsive'

const context = createContext<Responsive>(null!)

export function useResponsive() {
  const responsive = useContext(context)

  if (!responsive) {
    throw new Error('useResponsive must be used within a ResponsiveProvider')
  }

  return responsive
}

class ResponsiveBundle {
  responsive = new Responsive()
  frameId = -1

  update = () => {
    this.frameId = window.requestAnimationFrame(this.update)

    const { innerWidth: width, innerHeight: height } = window
    const { layoutObs, viewportObs } = this.responsive
    const pointerType = navigator.maxTouchPoints > 0
      ? PointerType.Touch
      : PointerType.Mouse

    if (width === viewportObs.value.width
      && height === viewportObs.value.height
      && pointerType === layoutObs.value.pointerType)
      return

    viewportObs.mutate({ width, height })
    layoutObs.enqueueMutation(viewportObs.value.computeLayout())
    layoutObs.enqueueMutation({ pointerType })
    layoutObs.flushMutations()

    document.documentElement.style.setProperty('--viewport-width', `${width}px`)
    document.documentElement.style.setProperty('--viewport-height', `${height}px`)

    for (const size of Object.values(ScreenSize))
      document.documentElement.classList.toggle(size, layoutObs.value.screenSize === size)

    for (const orientation of Object.values(Orientation))
      document.documentElement.classList.toggle(orientation, layoutObs.value.orientation === orientation)

    for (const type of Object.values(PointerType))
      document.documentElement.classList.toggle(type, layoutObs.value.pointerType === type)
  }

  destroy = () => {
    window.cancelAnimationFrame(this.frameId)
  }

  constructor() {
    this.update()
  }
}

export function ResponsiveProvider({ children }: { children?: React.ReactNode }) {
  const bundle = useMemo(() => new ResponsiveBundle(), [])
  useEffect(() => bundle.destroy)
  return (
    <context.Provider value={bundle.responsive}>
      {children}
    </context.Provider>
  )
}
