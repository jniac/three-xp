'use client'

import { Matrix4, Mesh, Vector3 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { fromVector3Declaration, Vector3Declaration } from 'some-utils-three/declaration'
import { AxesGeometry, AxisGeometry } from 'some-utils-three/geometries/axis'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { slerpVectors } from 'some-utils-three/math/slerp-vectors'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'


function MyScene() {
  const three = useThreeWebGL()!
  useGroup('slerp-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const helper = setup(new DebugHelper(), group)
      .regularGrid()

    const arrow = (() => {
      const _p = new Vector3()
      const _v = new Vector3()
      const _m = new Matrix4()
      const _x = new Vector3()
      const _y = new Vector3()
      const _z = new Vector3()
      return (p: Vector3Declaration, v: Vector3Declaration, { useBasis = true } = {}) => {
        fromVector3Declaration(p, _p)
        fromVector3Declaration(v, _v)
        _x.copy(_v).normalize()
        // _z.set(_x.y, _x.z, -_x.x)
        _y.set(-_x.y, _x.x, _x.z)
        _z.crossVectors(_x, _y).normalize()
        _m.makeBasis(_x, _y, _z).setPosition(_p)
        const length = _v.length()
        const geometry = useBasis
          ? new AxesGeometry({ length }).applyMatrix4(_m)
          : new AxisGeometry({ axis: 'x', length }).applyMatrix4(_m)
        const material = new AutoLitMaterial({ vertexColors: true })
        return setup(new Mesh(geometry, material), group)
      }
    })()

    const p = new Vector3()
    const v = new Vector3()
    const v1 = new Vector3()
    const v2 = new Vector3()
    const textOptions = { color: 'white', offset: [0, -.25, 0] as Vector3Declaration }

    {
      p.set(-2, 0, 0)
      v1.set(1, 1, 0)
      v2.set(-1, 1, 0)
      helper.text(p, `lerp`, textOptions)
      for (const it of loop(10))
        arrow(p, v.lerpVectors(v1, v2, it.p))
    }

    {
      p.set(0, 0, 0)
      v1.set(1, 1, 0)
      v2.set(-1, 1, 0)
      helper.text(p, `slerp`, textOptions)
      for (const it of loop(10))
        arrow(p, slerpVectors(v1, v2, it.p, v))
    }

    {
      p.set(3, 0, 0)
      v1.set(.5, .5, .5)
      v2.set(-1, 3, -1)
      helper.text(p, `slerp`, textOptions)
      helper.box({ min: p, max: p.clone().add(v1) })
      helper.box({ min: p.clone().add(v2), max: p })
      for (const it of loop(10))
        arrow(p, slerpVectors(v1, v2, it.p, v))
    }

    {
      p.set(5, 0, 0)
      v1.set(1, 0, 0)
      v2.set(-1, 0, 0)
      helper.text(p, `slerp 180`, textOptions)
      for (const it of loop(10))
        arrow(p, slerpVectors(v1, v2, it.p, v))
    }

    {
      p.set(5, -2, 0)
      v1.set(.25, 1, .5)
      v2.copy(v1).negate()
      helper.text(p, `slerp 180`, textOptions)
      helper.box({ min: p, max: p.clone().add(v1) })
      helper.box({ min: p.clone().add(v2), max: p })
      for (const it of loop(10))
        arrow(p, slerpVectors(v1, v2, it.p, v))
    }

  }, [])
  return null
}

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}
