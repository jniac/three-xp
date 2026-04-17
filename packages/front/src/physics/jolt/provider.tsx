'use client'

import { useState } from 'react'

import { useThree } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Message } from 'some-utils-ts/message'

import { initJolt, JoltInterface } from './jolt'

const JOLT_SYMBOL = Symbol('JoltPhysics')

export function useJoltPhysics() {
  return Message.send(JOLT_SYMBOL).assertPayload() as JoltInterface
}

export function JoltPhysicsProvider({ children }: { children?: React.ReactNode }) {
  const three = useThree()
  const [ready, setReady] = useState(false)

  useEffects(async function* () {
    const jolt = await initJolt(three)
    Message.on(JOLT_SYMBOL, message => message.setPayload(jolt))
    setReady(true)
  }, [])

  return ready && <>{children}</>
}
