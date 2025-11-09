import { Message } from 'some-utils-ts/message'

import { ToggleMobile } from '../../toggle-mobile'
import { FloatTrack } from './float-track'

export class WheelRecord {
  static async load(url: string) {
    const response = await window.fetch(url)
    const data = new Float32Array(await response.arrayBuffer())

    let min = Infinity
    let max = -Infinity
    let firstFrame = Infinity
    let lastFrame = 0
    let firstDeltaIndex = -1
    let lastDeltaIndex = -1
    for (let i = 0; i < data.length; i += 2) {
      const frame = data[i]
      const delta = data[i + 1]
      if (delta < min) min = delta
      if (delta > max) max = delta
      if (delta !== 0) {
        lastFrame = frame
        lastDeltaIndex = i
        if (firstFrame === Infinity) {
          firstDeltaIndex = i
          firstFrame = frame
        }
      }
    }

    const frameCount = lastFrame - firstFrame + 1

    const deltas = new Float32Array(frameCount)
    const cumulativeDeltas = new Float32Array(frameCount)
    let cumulative = 0
    let lastFrameIndex = 0
    for (let i = firstDeltaIndex; i <= lastDeltaIndex; i += 2) {
      const frame = data[i]
      const deltaY = data[i + 1]
      cumulative += deltaY
      const frameIndex = frame - firstFrame
      // Note: there might be multiple entries for the same frame
      const frameDelta = deltas[frameIndex] + deltaY
      deltas[frameIndex] = frameDelta

      // Note: fill in the gaps from lastFrameIndex to frameIndex
      for (let j = lastFrameIndex + 1; j <= frameIndex; j++) {
        cumulativeDeltas[j] = cumulative
      }

      lastFrameIndex = frameIndex
    }

    const record = new WheelRecord(new FloatTrack(deltas), new FloatTrack(cumulativeDeltas))
    record.isFinished = true
    record.url = url
    return record
  }

  deltaTrack: FloatTrack
  positionTrack: FloatTrack
  mobileTrack: FloatTrack

  isLive = false
  isFinished = false
  url?: string

  get frameCount() { return this.deltaTrack.data.length }

  constructor(...args: [deltaTrack: FloatTrack, positionTrack: FloatTrack] | [frameCount: number]) {
    const [deltaTrack, positionTrack] = args.length === 1
      ? (() => {
        const frameCount = args[0]
        return [
          new FloatTrack(new Float32Array(frameCount)),
          new FloatTrack(new Float32Array(frameCount)),
        ]
      })()
      : args
    this.deltaTrack = deltaTrack
    this.positionTrack = positionTrack
    this.mobileTrack = new FloatTrack(new Float32Array(this.deltaTrack.data.length))

    this.positionTrack.mapYOptions.minMaxValue = 0
    this.positionTrack.mapYOptions.maxMinValue = 4000
  }

  /**
   * 
   */
  mobileSimulation({
    mobilePositions = [0, 100],
    velocityThreshold = 200,
    distanceThreshold = 200,
  } = {}) {
    const mobile = new ToggleMobile({
      positions: mobilePositions,
    })
    let frame = 0
    const events = new Map<string, number[]>()
    mobile.on('*', (type, mobile) => {
      const frames = events.get(type) ?? []
      frames.push(frame)
      events.set(type, frames)
    })
    const { deltaTrack: deltas, frameCount, mobileTrack: mobileData } = this
    for (frame = 0; frame < frameCount; frame++) {
      mobile
        .dragAutoStart(deltas.data[frame], { distanceThreshold })
        .dragAutoStop({ velocityThreshold })
        .update(1 / 120) // Assume 120 FPS
      mobileData.data[frame] = mobile.position
    }
    return {
      mobileData,
      events,
    }
  }

  liveState = {
    pause: false,
    wheelTime: 0,
    wheelPosition: 0,
  };

  *initLiveRecording() {
    type Payload = { mobile: ToggleMobile, wheelDelta: number, wheelCumulativeDelta: number }

    this.isLive = true

    yield Message.on<Payload>('LIVE_TICK', message => {
      if (this.liveState.pause)
        return

      let { wheelTime, wheelPosition } = this.liveState
      const { mobile, wheelDelta } = message.assertPayload()

      if (mobile.movingStopDuration > 1.2)
        return

      wheelTime += 1 / 120
      wheelPosition += wheelDelta
      Object.assign(this.liveState, { wheelTime, wheelPosition })

      this.deltaTrack.push(wheelDelta)
      this.positionTrack.push(wheelPosition, { resetMethod: 'current-value' })
      this.mobileTrack.push(mobile.position)
    })
  }

  clear() {
    this.liveState.wheelPosition = 0
    this.liveState.wheelTime = 0

    this.deltaTrack.reset(0)
    this.positionTrack.reset(0)
    this.mobileTrack.reset(0)
  }
}
