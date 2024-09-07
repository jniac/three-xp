import { digestProps } from 'some-utils-react/hooks/digest'
import { Hash } from 'some-utils-ts/hash'
import { Test } from './Test'

export default function Home() {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <h1>Yo</h1>
      <Test />
      {digestProps({ a: 1, b: 2, c: 3 })}
      {Hash.init().updateString("hello").getValueAsInt32()}
    </div>
  )
}
