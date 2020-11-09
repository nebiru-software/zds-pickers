import { createSelector } from 'reselect'
import { compose } from 'redux'
import { get } from '../core/fp/objects'
import { not } from '../core/fp/utils'
import { stateShifter } from '.'

export const doesShifterExist = createSelector(
  stateShifter,
  get('found'),
)

export const isDisabled = createSelector(
  stateShifter,
  compose(
    not,
    get('ready'),
  ),
)

export default undefined
