import { ScrollMobile } from './scroll-mobile'

export function svgRepresentation(scrollMobile: ScrollMobile, {
  svg = <SVGSVGElement | null>null,
} = {}): SVGSVGElement {
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  }
  svg.setAttribute('viewBox', '-20 -20 100 500')
  svg.setAttribute('width', '100')
  svg.setAttribute('height', '500')

  let head = svg.querySelector('circle.head')
  if (!head) {
    head = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    head.classList.add('head')
    head.setAttribute('r', '5')
    head.setAttribute('fill', 'none')
    head.setAttribute('stroke', 'white')
    svg.appendChild(head)
  }

  const stops = [...svg.querySelectorAll('circle.stop')]
  while (stops.length < scrollMobile.props.stops.length) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.classList.add('stop')
    circle.setAttribute('r', '3')
    circle.setAttribute('fill', 'white')
    svg.appendChild(circle)
    stops.push(circle)
  }
  while (stops.length > scrollMobile.props.stops.length) {
    const circle = stops.pop()
    if (circle && circle.parentNode)
      circle.parentNode.removeChild(circle)
  }

  const remap = (position: number) => {
    const value = scrollMobile.inverseLerpPosition(position) * 200
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