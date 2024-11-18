import { PerspectiveCamera } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { fromAngleDeclaration } from 'some-utils-ts/declaration'
import { DestroyableInstance } from 'some-utils-ts/misc/destroy'
import { Tick } from 'some-utils-ts/ticker'
import { Scope } from './voxel/scope'

enum CameraHandlerMode {
  Free,
  Scope
}

export class CameraHandler {
  static Mode = CameraHandlerMode
  static instances = [] as CameraHandler[];

  camera!: PerspectiveCamera

  private _destroyables = new DestroyableInstance();

  private _mode = CameraHandlerMode.Free;
  get mode() { return this._mode }
  set mode(value: CameraHandlerMode) { this.setMode(value) }

  freeVertigoControls = new VertigoControls({
    size: 24,
    perspective: 1,
  })

  scopeVertigoControls = new VertigoControls({
    perspective: .5,
  })

  constructor() {
    CameraHandler.instances.push(this)
  }

  destroy = () => {
    this.freeVertigoControls.destroy()
    const index = CameraHandler.instances.indexOf(this)
    if (index === -1) throw new Error(`CameraHandler instance not found`)
    CameraHandler.instances.splice(index, 1)
  }

  initialize(camera: PerspectiveCamera, element: HTMLElement): this {
    this.camera = camera
    this.freeVertigoControls.start(element)
    return this
  }

  setMode(value: CameraHandlerMode) {
    value %= 2
    if (this._mode === value)
      return

    this._mode = value
    this.freeVertigoControls.toggle(value === CameraHandlerMode.Free)

    function toScope() {
      const scope = Scope.current()

      const [handler] = CameraHandler.instances
      const { width, height } = scope.state

      handler.mode = CameraHandler.Mode.Scope
      handler.scopeVertigoControls.dampedVertigo.copy(handler.freeVertigoControls.dampedVertigo)

      const rotation = scope.rotation.clone()
      rotation.x += fromAngleDeclaration('20deg')
      handler.scopeVertigoControls.vertigo.set({
        size: [width, height],
        focus: scope.position,
        rotation: rotation,
      })
    }

    function toFree() {
      const [handler] = CameraHandler.instances
      handler.mode = CameraHandler.Mode.Free
      handler.freeVertigoControls.dampedVertigo.copy(handler.scopeVertigoControls.dampedVertigo)
    }

    switch (value) {
      case CameraHandlerMode.Free: {
        toFree()
        break
      }
      case CameraHandlerMode.Scope: {
        toScope()
        break
      }
    }
  }

  onTick(tick: Tick, aspect: number) {
    switch (this._mode) {
      case CameraHandlerMode.Free: {
        this.freeVertigoControls.update(this.camera, aspect, tick.deltaTime)
        break
      }
      case CameraHandlerMode.Scope: {
        this.scopeVertigoControls.update(this.camera, aspect, tick.deltaTime)
        break
      }
    }
  }
}
