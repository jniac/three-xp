import { SvgDemo } from './svg-demo'

export function Client() {
  return (
    <div className='absolute-through p-4 flex flex-col gap-4'>
      <h1 className='text-4xl'>Path with loop</h1>
      <SvgDemo />
    </div>
  )
}