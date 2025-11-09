export class FloatTrack {
  data: Float32Array
  min: number
  max: number

  pushIndex = 0;

  constructor(arg: number | Float32Array) {
    const data = typeof arg === 'number' ? new Float32Array(arg) : arg
    this.data = data
    this.min = data.reduce((min, val) => Math.min(min, val), Infinity)
    this.max = data.reduce((max, val) => Math.max(max, val), -Infinity)
  }

  reset(resetValue = 0) {
    this.data.fill(resetValue)
    this.min = resetValue
    this.max = resetValue
  }

  /**
   * Push a new value into the data array.
   *
   * When the array is full, it resets and starts overwriting from the beginning.
   */
  push(value: number, { resetMethod = <'zero' | 'current-value'>'zero' } = {}) {
    this.data[this.pushIndex] = value
    if (value < this.min) this.min = value
    if (value > this.max) this.max = value
    this.pushIndex++

    if (this.pushIndex === this.data.length) {
      this.pushIndex = 0
      const resetValue = resetMethod === 'zero' ? 0 : value
      this.reset(resetValue)
    }
  }

  mapX = (index: number, { width = 500 } = {}) => {
    const length = this.data.length
    const scaleX = width / length
    return index * scaleX
  }

  mapYOptions = {
    margin: 100,
    minMaxValue: <number | undefined>undefined,
    maxMinValue: <number | undefined>undefined,
  }
  mapY = (value: number, { height = 200 } = {}) => {
    let min = this.mapYOptions.minMaxValue !== undefined
      ? Math.min(this.mapYOptions.minMaxValue, this.min) : this.min
    let max = this.mapYOptions.maxMinValue !== undefined
      ? Math.max(this.mapYOptions.maxMinValue, this.max) : this.max
    min -= this.mapYOptions.margin
    max += this.mapYOptions.margin
    const delta = max - min
    const mapY = 1 / (delta === 0 ? 1 : delta)
    return (1 - (value - min) * mapY) * height
  }

  getSvgPathData({ width = 500, height = 200, mapY = this.mapY } = {}) {
    const pathData: string[] = []
    const length = this.data.length
    for (let i = 0; i < length; i++) {
      const x = this.mapX(i, { width })
      const y = mapY(this.data[i], { height })
      const command = i === 0 ? 'M' : 'L'
      pathData.push(`${command} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return pathData.join(' ')
  }
}
