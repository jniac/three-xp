'use client'

import { useEffects } from 'some-utils-react/hooks/effects'

import { HierarchyComponent, InspectorComponent, SelectionHandler } from './editor-parts'

function EditorManager() {
  useEffects(function* () {
    const selection = new SelectionHandler()
    yield selection
  }, [])
  return null
}

function Tile({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className='w-fit p-4 rounded overflow-hidden border-white/20'
      style={{
        backdropFilter: 'blur(32px) brightness(84%)',
      }}
    >
      {children}
    </div>
  )
}

export function Editor() {
  return (
    <>
      <EditorManager />
      <div className='ui layer thru p-8 flex flex-row justify-between'>
        <div>
          <h1 className='text-2xl font-bold mb-2'>
            Glass
          </h1>
          <Tile>
            <HierarchyComponent />
          </Tile>
        </div>

        <div>
          <Tile>
            <InspectorComponent />
          </Tile>
        </div>
      </div>
    </>
  )
}