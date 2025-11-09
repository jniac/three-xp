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
  liveState = {
    pause: false,
  }

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

  *initLiveRecording() {
    type Payload = { mobile: ToggleMobile, wheelDelta: number, wheelCumulativeDelta: number }

    this.isLive = true
    let movingTime = 0

    yield Message.on<Payload>('LIVE_TICK', message => {
      if (this.liveState.pause)
        return

      const { mobile, wheelDelta, wheelCumulativeDelta } = message.assertPayload()
      movingTime += 1 / 120
      this.deltaTrack.push(wheelDelta)
      this.positionTrack.push(wheelCumulativeDelta, { resetMethod: 'current-value' })
      this.mobileTrack.push(mobile.position)
    })
  }
}
