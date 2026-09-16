'use client'
import { Vector2 } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug/debug-helper'
import { Matrix2 } from 'some-utils-three/math/Matrix2'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'

function MyGroup() {
  useGroup('MyGroup', function* (group) {
    setup(new DebugHelper(), group).regularGrid()

    const u = new Vector2(2, 0)
    const v = new Vector2(2, 2)
    const m = new Matrix2().set(
      u.x, v.x,
      u.y, v.y,
    )
    const mInv = m.clone().invert()

    const helper = setup(new DebugHelper(), group).zOffset(.01)

    for (const it of loop(32)) {
      const angle = it.t * Math.PI * 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const p = new Vector2(cos, sin)
      mInv.applyTo(p)
      const w = new Vector2()
        .addScaledVector(u, p.x)
        .addScaledVector(v, p.y)
      helper.line(0, w, { color: '#09f' })
    }

    helper.line(0, u, { color: '#f03', arrow: { position: 1 } })
    helper.line(0, v, { color: '#0f9', arrow: { position: 1 } })
  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 5,
      }}
    >
      <MyGroup />
    </ThreeProvider>
  )
}