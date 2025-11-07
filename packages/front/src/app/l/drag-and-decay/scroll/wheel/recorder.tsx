import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { onTick, Ticker } from 'some-utils-ts/ticker'

function download(data: Float32Array, filename: string) {
  const blob = new Blob([data as any], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function WheelRecorder({
  duration = 5,
}) {
  const floatCount = 120 * duration * 2 // 120 fps, 2 floats per frame

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const progressBarFill = div.querySelector('.ProgressBarFill') as HTMLDivElement
    progressBarFill.style.width = '0%'

    const downloadButton = div.querySelector('button') as HTMLButtonElement

    downloadButton.onclick = () => {
      download(data, `wheel-recording-${duration}s-${floatCount}floats.bin`)
    }

    const data = new Float32Array(floatCount)

    let i = 0
    const startFrame = Ticker.current().frame
    yield handlePointer(document.documentElement, {
      onWheel: info => {
        if (i + 1 < floatCount) {
          data[i++] = Ticker.current().frame - startFrame
          data[i++] = info.delta.y
          const progress = i / floatCount
          progressBarFill.style.width = `${(progress * 100).toFixed(2)}%`
        }
      },
      onWheelFrame: () => {

      },
    })

    yield onTick(() => {

    })
  }, [])

  return (
    <div
      ref={ref}
      className='w-32 flex flex-col items-center gap-1'
    >
      <div className='ProgressBar w-full h-2 bg-[#fff3] rounded overflow-hidden'>
        <div className='ProgressBarFill w-1/2 h-full bg-[white]' />
      </div>
      <button
        className='text-xs border border-white/20 rounded px-2 py-1 hover:bg-white/10'
      >
        <div>
          WheelRecorder
        </div>
        <div>
          ({duration}s, {floatCount} floats)
        </div>
      </button>
    </div>
  )
}
