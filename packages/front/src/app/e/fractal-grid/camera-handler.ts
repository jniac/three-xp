import { PerspectiveCamera, Vector2 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DestroyableInstance } from 'some-utils-ts/misc/destroy'
import { onTick, Tick } from 'some-utils-ts/ticker'
import { Scope } from './voxel/scope'
import { FractalGridWorld } from './voxel/world'

enum CameraHandlerMode {
  Free,
  Scope
}

class ScopeCameraHandler {
  position = new Vector2()
  dampedPosition = new Vector2()
  scale = 1

  private _destroyables = new DestroyableInstance()

  element!: HTMLElement

  vertigoControls = new VertigoControls({
    perspective: .5,
  })

  initialize(element: HTMLElement): this {
    this.element = element
    return this
  }

  private *doStart(element: HTMLElement = this.element ?? document.body) {
    yield handlePointer(element, {
      onDrag: info => {
        const world = FractalGridWorld.current()
        world.scopeCoordinates.x += -info.delta.x * .005 / world.worldScale
        world.scopeCoordinates.y += -info.delta.y * .01
      },
    })

    yield onTick('three', tick => {
      const world = FractalGridWorld.current()
      world.scopeUpdate(tick.deltaTime)

      const focus = world.scope.position
      this.vertigoControls.vertigo.set({ focus })
      this.vertigoControls.dampedVertigo.set({ focus })
    })
  }

  _started = false

  start(...args: Parameters<typeof this.doStart>) {
    if (this._started)
      return

    this._destroyables.collect(this.doStart(...args))

    this._started = true
  }

  stop() {
    if (!this._started)
      return

    this._destroyables.destroy()

    this._started = false
  }

  toggle(start = !this._started) {
    if (start) {
      this.start()
    } else {
      this.stop()
    }
  }

  destroy = () => {
    this._destroyables.destroy()
  }

  update(camera: PerspectiveCamera, aspect: number, deltaTime: number) {
    this.vertigoControls.update(camera, aspect, deltaTime)
  }
}

export class CameraHandler {
  static Mode = CameraHandlerMode
  static instances = [] as CameraHandler[];

  camera!: PerspectiveCamera

  private _mode = CameraHandlerMode.Free
  get mode() { return this._mode }
  set mode(value: CameraHandlerMode) { this.setMode(value) }

  freeVertigoControls = new VertigoControls({
    size: 24,
    perspective: 1,
  })

  scopeCameraHandler = new ScopeCameraHandler()

  constructor() {
    CameraHandler.instances.push(this)
  }

  destroy = () => {
    this.freeVertigoControls.destroy()
    this.scopeCameraHandler.destroy()

    const index = CameraHandler.instances.indexOf(this)
    if (index === -1) throw new Error(`CameraHandler instance not found`)
    CameraHandler.instances.splice(index, 1)
  }

  initialize(camera: PerspectiveCamera, element: HTMLElement): this {
    this.camera = camera
    this.freeVertigoControls.initialize(element).toggle(this._mode === CameraHandlerMode.Free)
    this.scopeCameraHandler.initialize(element).toggle(this._mode === CameraHandlerMode.Scope)

    const props = Scope.current().toVertigoProps()
    this.scopeCameraHandler.vertigoControls.vertigo.set(props)
    this.scopeCameraHandler.vertigoControls.dampedVertigo.set(props)

    return this
  }

  setMode(value: CameraHandlerMode) {
    value %= 2
    if (this._mode === value)
      return

    this._mode = value
    this.freeVertigoControls.toggle(value === CameraHandlerMode.Free)
    this.scopeCameraHandler.toggle(value === CameraHandlerMode.Scope)

    const toScope = () => {
      this.mode = CameraHandler.Mode.Scope
      this.scopeCameraHandler.vertigoControls.dampedVertigo.copy(this.freeVertigoControls.dampedVertigo)
      this.scopeCameraHandler.vertigoControls.vertigo.set(Scope.current().toVertigoProps())
    }

    const toFree = () => {
      this.mode = CameraHandler.Mode.Free
      this.freeVertigoControls.dampedVertigo.copy(this.scopeCameraHandler.vertigoControls.dampedVertigo)
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
        console.log()
        break
      }
      case CameraHandlerMode.Scope: {
        this.scopeCameraHandler.update(this.camera, aspect, tick.deltaTime)
        break
      }
    }
  }
}
