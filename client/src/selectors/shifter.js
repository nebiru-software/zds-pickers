import { createSelector } from 'reselect'
import { get } from '../core/fp/objects'
import { stateShifter } from '.'

export const doesShifterExist = createSelector(
  stateShifter,
  get('found'),
)

export default undefined
