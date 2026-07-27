import { CanvasTexture, Vector2 } from 'three'

import { Pool } from 'some-utils-ts/experimental/pool'

class CircleAgent {
  position = new Vector2()

  arcCenter = new Vector2()
  arcRadius = 50
  arcStartAngle = 0

  velocity = 100
  size = 10

  update(time: number) {
    if (this.arcRadius === 0) {
      this.position.copy(this.arcCenter)
    } else {
      const angleVelocity = this.velocity / this.arcRadius
      const angle = this.arcStartAngle + angleVelocity * time
      this.position.set(
        this.arcCenter.x + Math.cos(angle) * this.arcRadius,
        this.arcCenter.y + Math.sin(angle) * this.arcRadius,
      )
    }
  }
}

export class WaterInputMap {
  size: Vector2
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: CanvasTexture

  state = {
    circleAgentPool: new Pool({
      create: () => new CircleAgent(),
      onUpdate: (agent, { time }) => {
      },
      maxCapacity: 100,
    }),
  }

  constructor(size: Vector2) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = size.x
    this.canvas.height = size.y
    this.size = size
    this.ctx = this.canvas.getContext('2d')!
    this.texture = new CanvasTexture(this.canvas)
  }

  fill(color: string) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.size.x, this.size.y)
    this.texture.needsUpdate = true
  }

  circle(x: number, y: number, radius: number, color: string) {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fill()
    this.texture.needsUpdate = true
  }

  update(deltaTime: number, maxCircleAgents = 10) {
    this.state.circleAgentPool.update(deltaTime)
    if (this.state.circleAgentPool.activeCount < maxCircleAgents && Math.random() < 0.01) {
      const lifetime = 1 + Math.random() * 2
      const binding = this.state.circleAgentPool.acquire({ lifetime })
      binding.value.arcCenter.set(Math.random() * this.size.x, Math.random() * this.size.y)
      binding.value.arcStartAngle = Math.random() * Math.PI * 2
      binding.value.arcRadius = 20 + Math.random() * 30
      binding.value.velocity = 50 + Math.random() * 100
      binding.value.size = 5 + Math.random() * 10
    }

    this.fill('black')
    for (const { value: agent, time, progress } of this.state.circleAgentPool.activeBindings()) {
      agent.update(time)
      const size = agent.size * Math.sin(progress * Math.PI)
      this.circle(agent.position.x, agent.position.y, size, 'white')
    }
  }
}
