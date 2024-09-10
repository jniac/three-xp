'use client'

import { useState } from 'react'

import { Message } from 'some-utils-ts/message'

import { BasicThreeProvider, UseThree } from '@/tools/three/webgl'

import { twoEnvDemo } from './gl/two-env-demo'

import styles from './styles.module.css'

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
    <div className={styles.UI}>
      <h1 className='text-2xl uppercase mb-2'>
        <a href='https://github.com/jniac/three-xp/tree/main/packages/front/src/app/e/two-env-demo'>
          two-env-demo
        </a>
      </h1>
      <Slider label='envMix' value={envMix} onChange={updateEnvMix} />
      <Slider label='skyRoughness' value={skyRoughness} onChange={updateSkyRoughness} />
      <div className='Info text-xs mt-8'>
        <h2 className='text-xl'>Info</h2>
        <p className='mt-2'>
          This demo works by providing 2 env map to a custom fragment shader
          derived from the MeshStandardMaterial (envMap1, envMap2). A dedicated
          uniform allow to mix the two maps (envMix).
        </p>
        <p className='mt-2'>
          Another solution (not implemented here) would be to use a render target
          to mix the two envmaps into a single texture. This would be more efficient
          if the texture is used multiple times, and would also require less code
          and be more future-proof. For specific use cases, this solution is still
          relevant.
        </p>

        <h2 className='text-xl  mt-4'>Links</h2>
        <h3 className='text-base mt-2'>Three.js:</h3>
        <ul>
          <li>
            <a href='https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib/meshphysical.glsl.js'>ShaderLib/meshphysical.glsl.js</a>
          </li>
          <li>
            <a href='https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/cube_uv_reflection_fragment.glsl.js'>ShaderChunk/cube_uv_reflection_fragment.glsl.js</a>
          </li>
        </ul>
        <h3 className='text-base mt-2'>Demo:</h3>
        <ul>
          <li>
            <span>demo (loading files, setup the scene, helmet, sky)</span>
            <a href='https://github.com/jniac/three-xp/blob/main/packages/front/src/app/e/two-env-demo/gl/two-env-demo.ts'>gl/two-env-demo.ts</a>
          </li>
          <li>
            <span>Custom fragment shader:</span>
            <span>Pattern: <code style={{ fontSize: '.9em' }}>{`// FORK: use two envmaps ->`}</code></span>
            <a href='https://github.com/jniac/three-xp/blob/main/packages/front/src/app/e/two-env-demo/glsl/mesh_standard_material_custom_fragment.glsl.ts'>glsl/mesh_standard_material_custom_fragment.glsl.ts</a>
          </li>
          <li>
            <span>Custom sky:</span>
            <a href='https://github.com/jniac/three-xp/blob/main/packages/front/src/app/e/two-env-demo/gl/sky.ts'>gl/sky.ts</a>
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
        <div className='wraps p-8 flex flex-col'>
          <UI />
          <UseThree fn={twoEnvDemo} />
        </div>
      </BasicThreeProvider>
    </div>
  )
}