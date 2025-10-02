import { FuzzyRangeDeclaration } from 'some-utils-ts/math/easing/fuzzy-range'
import { TransitionDeclaration } from 'some-utils-ts/math/easing/transition'

export const defaultRangeProps = {
  length: 1,
  range: <FuzzyRangeDeclaration>{ center: 0.5, length: 0.5, fade: 0.2 },
  ease: <TransitionDeclaration | [start: TransitionDeclaration, end: TransitionDeclaration]>'linear',
}

export type RangeProps = Partial<typeof defaultRangeProps>

export const settings = {
  width: 300,
  height: 200,
  padding: 20,
}
