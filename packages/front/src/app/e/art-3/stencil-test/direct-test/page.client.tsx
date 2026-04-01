'use client'

import { AlwaysStencilFunc, Color, ConeGeometry, EqualStencilFunc, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, ReplaceStencilOp, Scene, WebGLRenderer } from 'three'

import { useEffects } from 'some-utils-react/hooks/effects'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'

export function DirectTest() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const renderer = new WebGLRenderer({
      stencil: true,
    })
    renderer.setSize(500, 500)
    renderer.setPixelRatio(2)

    const scene = new Scene()
    scene.background = new Color('#ddd')

    const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    {
      const geometry = new PlaneGeometry()
      const material = new MeshBasicMaterial({
        color: 'white',
        // side: DoubleSide,
      })
      material.stencilWrite = true
      material.stencilRef = 1
      material.stencilFunc = AlwaysStencilFunc
      material.stencilZPass = ReplaceStencilOp
      material.depthWrite = false
      const plane = new Mesh(geometry, material)
      plane.position.z = 1
      scene.add(plane)
    }

    {
      const geometry = new ConeGeometry(1, 1, 128)
      const material = new MeshBasicMaterial({
        color: 'red',
      })
      material.stencilWrite = true
      material.stencilRef = 1
      material.stencilFunc = EqualStencilFunc
      const cone = new Mesh(geometry, material)
      scene.add(cone)
    }

    const controls = new VertigoControls().start()
    controls.initialize(renderer.domElement, scene)

    const animate = function () {
      requestAnimationFrame(animate)
      controls.update(camera, camera.aspect)
      renderer.render(scene, camera)
    }
    animate()

    div.appendChild(renderer.domElement)
    yield () => renderer.domElement.remove()
  }, 'always')

  return (
    <div ref={ref} />
  )
}