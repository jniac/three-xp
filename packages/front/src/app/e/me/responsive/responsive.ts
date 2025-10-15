import { ObservableTree } from 'some-utils-ts/observables'

export enum ScreenSize {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

export function inferScreenSize(width: number, height: number): ScreenSize {
  if (width < 768) {
    return ScreenSize.Mobile
  } else if (width < 1024) {
    return ScreenSize.Tablet
  } else {
    return ScreenSize.Desktop
  }
}

export enum Orientation {
  Portrait = 'portrait',
  Landscape = 'landscape',
}

export enum PointerType {
  Touch = 'touch',
  Mouse = 'mouse',
}

export class Layout {
  screenSize = ScreenSize.Desktop
  orientation = Orientation.Landscape
  pointerType = PointerType.Mouse
}

export class Viewport {
  get aspect() { return this.width / this.height }

  constructor(
    public width: number,
    public height: number,
  ) { }

  computeLayout(out = new Layout()): Layout {
    out.orientation = this.aspect >= 1 ? Orientation.Landscape : Orientation.Portrait
    out.screenSize = inferScreenSize(this.width, this.height)
    return out
  }
}

export class Responsive {
  layoutObs = new ObservableTree(new Layout())
  viewportObs = new ObservableTree(new Viewport(1280, 1024))
}
