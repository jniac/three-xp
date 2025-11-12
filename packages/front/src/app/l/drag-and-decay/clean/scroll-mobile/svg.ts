import { ScrollMobile } from './scroll-mobile'

export function svgRepresentation(scrollMobile: ScrollMobile, {
  svg = <SVGSVGElement | null>null,
  margin = 20,
  width = 100,
  height = 500,
  stopRadius = 3,
  headRadius = 5,
  color = 'white',
} = {}): SVGSVGElement {
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  }
  const fullWidth = width + margin * 2
  const fullHeight = height + margin * 2
  svg.setAttribute('viewBox', `${-margin} ${-margin} ${fullWidth} ${fullHeight}`)
  svg.setAttribute('width', `${fullWidth}`)
  svg.setAttribute('height', `${fullHeight}`)

  let head = svg.querySelector('circle.head')
  if (!head) {
    head = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    head.classList.add('head')
    head.setAttribute('r', `${headRadius}`)
    head.setAttribute('fill', 'none')
    head.setAttribute('stroke', color)
    svg.appendChild(head)
  }

  const stops = [...svg.querySelectorAll('circle.stop')]
  while (stops.length < scrollMobile.props.stops.length) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.classList.add('stop')
    circle.setAttribute('r', `${stopRadius}`)
    circle.setAttribute('fill', color)
    svg.appendChild(circle)
    stops.push(circle)
  }
  while (stops.length > scrollMobile.props.stops.length) {
    const circle = stops.pop()
    if (circle && circle.parentNode)
      circle.parentNode.removeChild(circle)
  }

  const remap = (position: number) => {
    const value = scrollMobile.inverseLerpPosition(position) * (height - 2 * margin)
    return value
  }

  for (let i = 0; i < scrollMobile.props.stops.length; i++) {
    const pos = scrollMobile.props.stops[i]
    const y = remap(pos)
    const circle = stops[i]
    circle.setAttribute('cy', `${y}`)
  }

  head.setAttribute('cy', `${remap(scrollMobile.position)}`)

  return svg
}