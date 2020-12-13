import { nanoid } from 'nanoid'
import { CURRENT_CLIENT_VERSION } from '../midi'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

export const actions = {
  checkVersion: () => ({
    type: actionTypes.GET_SYSEX_VERSION,
    serialNumber: nanoid(14),
  }),

  checkModel: () => ({
    type: actionTypes.GET_SYSEX_MODEL,
  }),

  receivedVersion: (firmware, serialNumber) => ({
    type: actionTypes.RECEIVED_VERSION,
    firmware,
    serialNumber,
  }),
}

const defaultState = {
  checking: false,
  checked: false,
  client: CURRENT_CLIENT_VERSION,
  firmware: NaN,
}

const checkingVersion = state => ({
  ...state,
  checking: true,
  checked: false,
})

const receivedVersion = (state, { firmware }) => ({
  ...state,
  firmware,
  checking: false,
  checked: true,
})

const shifterMissing = state => ({
  ...state,
  checking: false,
  checked: false,
})

export default createReducer(defaultState, {
  [actionTypes.GET_SYSEX_VERSION]: checkingVersion,
  [actionTypes.RECEIVED_VERSION]: receivedVersion,
  [actionTypes.SHIFTER_MISSING]: shifterMissing,
})
