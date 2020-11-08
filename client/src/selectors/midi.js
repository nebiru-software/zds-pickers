import { compose } from 'redux'
import { createSelector } from 'reselect'
import { filter, first } from '../core/fp/arrays'
import { get } from '../core/fp/objects'
import { matches } from '../core/fp/utils'
import { stateMidi } from '.'

export const getInputDeviceId = createSelector(
  stateMidi,
  compose(
    first,
    filter(matches('name', 'ZDS Shifter Pro')),
    filter(matches('state', 'connected')),
    filter(matches('type', 'input')),
    get('devices'),
  ),
)

export const getOutputDeviceId = createSelector(
  stateMidi,
  compose(
    first,
    filter(matches('name', 'ZDS Shifter Pro')),
    filter(matches('state', 'connected')),
    filter(matches('type', 'output')),
    get('devices'),
  ),
)
