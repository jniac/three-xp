'use client'

import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ShaderChunk, ShaderLib } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { makeClassName } from 'some-utils-react/utils/classname'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'

import { useIsClient } from '@/utils/is-client'

import IconCopySvg from '@/components/svg/icon-copy.svg'

import { Copyable } from './components/Copyable'

import { IconButton } from './components/IconButton'

import style from './style.module.css'

const shaderPrograms = [
  'vertexShader',
  'fragmentShader',
] as const

function resolveShaderIncludes(shaderCode: string) {
  return shaderCode.replace(/#include <(.*)>/g, (match, p1) => {
    const chunk = ShaderChunk[p1 as keyof typeof ShaderChunk]
    if (!chunk) {
      throw new Error(`Shader chunk "${p1}" not found`)
    }
    return chunk
  })
}

function parseFromHash() {
  let [libName, shaderProgram, chunkName] = window.location.hash.slice(1).split(',') as
    [keyof typeof ShaderLib, typeof shaderPrograms[number], keyof typeof ShaderChunk | null]
  if (libName === undefined || !(libName in ShaderLib)) {
    libName = 'basic'
  }
  if (shaderProgram === undefined || !shaderPrograms.includes(shaderProgram as any)) {
    shaderProgram = shaderPrograms[0]
  }
  if (chunkName === undefined || (chunkName && !(chunkName in ShaderChunk))) {
    chunkName = null
  }
  return {
    libName,
    shaderProgram,
    chunkName,
  }
}

function Internal_Client() {
  const initial = parseFromHash()
  const [libName, setLibName] = useState<keyof typeof ShaderLib>(initial.libName)
  const [shaderProgram, setShaderProgram] = useState<typeof shaderPrograms[number]>(initial.shaderProgram)
  const [[chunkName, rect], setChunk] = useState<[keyof typeof ShaderChunk | null, Rectangle]>([initial.chunkName, new Rectangle()])
  const [showFinalProgram, setShowFinalProgram] = useState(false)

  window.location.hash = [libName, shaderProgram, chunkName].filter(v => !!v).join(',')

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const includes = [...div.querySelectorAll('span')]
      .filter(span => span.textContent === 'include')
      .map(span => {
        const space = span.nextElementSibling!
        const next = space.nextElementSibling! as HTMLSpanElement
        const chunkName = next.textContent!.slice(1, -1)
        const spans = [span.previousElementSibling!, span, space, next] as HTMLSpanElement[]
        return { spans, chunkName }
      })

    for (const { spans, chunkName } of includes) {
      const onEnter = (event: Event) => {
        event.stopPropagation()
        for (const span of spans) {
          span.classList.add(style.Hover)
        }
      }
      const onLeave = (event: Event) => {
        event.stopPropagation()
        for (const span of spans) {
          span.classList.remove(style.Hover)
        }
      }
      const onClick = (event: Event) => {
        event.stopPropagation()
        const rect = Rectangle
          .from(spans[0].getBoundingClientRect())
          .union(Rectangle.from(spans[spans.length - 1].getBoundingClientRect()))
        setChunk([chunkName as any, rect])
      }
      for (const span of spans) {
        span.classList.add(style.Include)
        span.addEventListener('pointerenter', onEnter)
        span.addEventListener('pointerleave', onLeave)
        span.addEventListener('click', onClick)
      }
    }

    yield handlePointer(div, {
      onTap: info => {
        const overlay = div.querySelector(`.${style.OverlayContentWrapper}`)!
        if (overlay && overlay.contains(info.orignalDownEvent.target as Node) === false) {
          setChunk([null, new Rectangle()])
        }
      }
    })
  }, [libName, shaderProgram])

  let program = ShaderLib[libName][shaderProgram]

  if (showFinalProgram) {
    program = resolveShaderIncludes(program)
  }

  const highlightRect = rect.area === 0 ? rect : rect.clone().applyPadding([2, 6], 'grow')
  return (
    <div ref={ref} className={makeClassName(style.ShaderXplr, 'absolute-through p-4 flex flex-col gap-4')}>
      <h1>ShaderXplr</h1>
      <div className={makeClassName(style.Base, chunkName !== null && style.Dim)} style={{ background: atomOneDark.hljs.background }}>
        <div className={style.Selectors}>
          <select
            name='shaderlib'
            id='shaderlib'
            onChange={event => setLibName(event.target.value as any)}
          >
            {Object.keys(ShaderLib).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>

          <select
            name='shaderprogram'
            id='shaderprogram'
            onChange={event => setShaderProgram(event.target.value as any)}
          >
            {shaderPrograms.map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>

          <div className='flex flex-row items-center gap-3 px-2 bg-[#fff1] rounded-[.25em]'>
            <label htmlFor='showFinalProgram'>Show final program</label>
            <input
              type='checkbox'
              id='showFinalProgram'
              checked={showFinalProgram}
              onChange={event => setShowFinalProgram(event.target.checked)}
            />
          </div>
        </div>

        <div className={style.BaseContentWrapper}>
          <SyntaxHighlighter language='cpp' style={atomOneDark}>
            {program}
          </SyntaxHighlighter>
        </div>
      </div>

      <div className='absolute-through'>
        <div
          className={style.IncludeHighlight}
          style={{
            top: `${highlightRect.top}px`,
            left: `${highlightRect.left}px`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,
          }}
        />
        {chunkName && (
          <div className={style.Overlay}>
            <div style={{ height: `${Math.max(rect.top, 110)}px`, pointerEvents: 'none' }} />
            <div className={style.OverlayContentWrapper} style={{ background: atomOneDark.hljs.background }}>
              <div className={style.TitleBar}>
                <h1>{chunkName}</h1>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(chunkName)
                  }}
                >
                  <IconCopySvg />
                </IconButton>
              </div>
              <Copyable>
                <SyntaxHighlighter language='cpp' style={atomOneDark}>
                  {ShaderChunk[chunkName]}
                </SyntaxHighlighter>
              </Copyable>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function Client() {
  return useIsClient() && <Internal_Client />
}
