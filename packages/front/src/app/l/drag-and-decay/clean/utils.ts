
export function computeStops(div: HTMLDivElement): number[] {
  const parent = div.parentElement as HTMLDivElement
  const sections = [...div.querySelectorAll('section')]
  const stops = sections.map(section => 0)

  // Middle positions: div are centered in the viewport
  for (let i = 1, max = sections.length - 1; i < max; i++) {
    const section = sections[i]
    const p = section.offsetTop - (parent.clientHeight - section.clientHeight) / 2
    stops[i] = p
  }

  // Last position: bottom of last section at bottom of viewport
  stops[sections.length - 1] = parent.scrollHeight - parent.clientHeight

  return stops
}
