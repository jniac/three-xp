'use client'

import { useState } from 'react'

import { Message } from 'some-utils-ts/message'

import { BasicThreeProvider, UseThree } from '@/tools/basic-three'

import { twoEnvDemo } from './gl/two-env-demo'

function Slider({ label, value, onChange }: { label: string, value: number, onChange: (value: number) => void }) {
  return (
    <div className='flex flex-row gap-2'>
      <label htmlFor={label}>{label}</label>
      <input
        type="range"
        name={label}
        id={label}
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <span>{value.toFixed(2)}</span>
    </div>
  )
}

function UI() {
  const [envMix, setEnvMix] = useState(0)
  const [skyRoughness, setSkyRoughness] = useState(.5)

  function updateEnvMix(value: number) {
    setEnvMix(value)
    Message.send('INPUT:ENV_MIX', { payload: { value } })
  }
  function updateSkyRoughness(value: number) {
    setSkyRoughness(value)
    Message.send('INPUT:SKY_ROUGHNESS', { payload: { value } })
  }

  return (
    <div className='UI'>
      <h1 className='text-2xl uppercase'>two-env-demo</h1>
      <Slider label='envMix' value={envMix} onChange={updateEnvMix} />
      <Slider label='skyRoughness' value={skyRoughness} onChange={updateSkyRoughness} />
      <div>
        <ul>
          <li>
            <a href='https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib/meshphysical.glsl.js'>ShaderLib/meshphysical</a>
          </li>
          <li>
            <a href='https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/cube_uv_reflection_fragment.glsl.js'>ShaderChunk/cube_uv_reflection_fragment</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export function Demo() {
  return (
    <div className='Demo wraps'>
      <BasicThreeProvider>
        <div className='wraps p-8'>
          <UI />
          <UseThree fn={twoEnvDemo} />
        </div>
      </BasicThreeProvider>
    </div>
  )
}