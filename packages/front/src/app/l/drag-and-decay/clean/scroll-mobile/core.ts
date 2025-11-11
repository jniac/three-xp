
export enum ClosestDirection {
  Both = 0,
  Forward = 1,
  Backward = 2
}

export function getClosestStopIndex(stops: number[], position: number, direction: ClosestDirection = ClosestDirection.Both): number {
  let closestIndex = 0
  let closestDistance = Infinity

  switch (direction) {
    case ClosestDirection.Forward:
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i]
        if (stop < position)
          continue
        const distance = Math.abs(stop - position)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }
      return closestIndex

    case ClosestDirection.Backward:
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i]
        if (stop > position)
          continue
        const distance = Math.abs(stop - position)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }
      return closestIndex

    default:
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i]
        const distance = Math.abs(stop - position)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }
      return closestIndex
  }
}
