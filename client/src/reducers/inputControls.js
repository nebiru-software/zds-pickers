/* eslint-disable no-plusplus, no-bitwise */
import chunk from 'lodash/chunk'
import { MASK_CHANNEL, MASK_STATUS, assertRange } from 'zds-pickers'
import { createReducer } from '../utils'
import { MASK_CURVE, MASK_LATCHING, MASK_POLARITY } from '../midi'
import inputControl from './inputControl'
import actionTypes from './actionTypes'

export const actions = {
  askForControls: () => ({
    type: actionTypes.GET_SYSEX_CONTROLS,
  }),

  receivedControls: controlData => ({
    type: actionTypes.RECEIVED_CONTROLS,
    controlData,
  }),

  changeControlType: () => ({
    type: actionTypes.CHANGE_CONTROL_TYPE,
  }),

  changeInputControlChannel: (controlId, channel) => ({
    type: actionTypes.CHANGE_INPUT_CONTROL_CHANNEL,
    controlId,
    channel: assertRange(channel, 15, 0),
  }),

  changeInputControlLatching: (controlId, latching) => ({
    type: actionTypes.CHANGE_INPUT_CONTROL_LATCHING,
    controlId,
    latching,
  }),

  changeInputControlPolarity: (controlId, polarity) => ({
    type: actionTypes.CHANGE_INPUT_CONTROL_POLARITY,
    controlId,
    polarity,
  }),

  changeInputControlValue: (controlId, value) => ({
    type: actionTypes.CHANGE_INPUT_CONTROL_VALUE,
    controlId,
    value: assertRange(value, 127, 0),
  }),

  receivedInternalState: packet => ({
    type: actionTypes.RECEIVED_STATE,
    packet,
  }),
}

const modifyControl = (
  state,
  action, //
) => state.map(control => inputControl(control, action))

const receivedControls = (
  state,
  { controlData }, //
) => chunk(controlData, 5) //
  .map(([status, value, flags, calibrationLow, calibrationHigh], i) => inputControl(
    {
      controlId: i,
      channel: status & MASK_CHANNEL,
      calibrationLow,
      calibrationHigh,
      curve: (flags & MASK_CURVE) >> 2,
      polarity: (flags & MASK_POLARITY) >> 1,
      latching: flags & MASK_LATCHING,
      status: ((status & MASK_STATUS) >> 4) | 8,
      value,
      active: false,
      lit: false,
    },
    { type: 'NO_ACTION' },
  ))

const receivedInternalState = (state, { packet }) => {
  const [numControls, ...rest] = packet
  rest.pop() // Settings flag
  const [active, lit] = chunk(rest.map(val => Boolean(val)), numControls)

  return state.map((control, idx) => ({ ...control, active: active[idx], lit: lit[idx] }))
}

const handleShifterUnplugged = () => []

export default createReducer([], {
  [actionTypes.CHANGE_INPUT_CONTROL_CHANNEL]: modifyControl,
  [actionTypes.CHANGE_INPUT_CONTROL_LATCHING]: modifyControl,
  [actionTypes.CHANGE_INPUT_CONTROL_POLARITY]: modifyControl,
  [actionTypes.CHANGE_INPUT_CONTROL_VALUE]: modifyControl,
  [actionTypes.RECEIVED_CONTROLS]: receivedControls,
  [actionTypes.SHIFTER_MISSING]: handleShifterUnplugged,
  [actionTypes.FACTORY_RESET]: handleShifterUnplugged,
  [actionTypes.RECEIVED_STATE]: receivedInternalState,
})
