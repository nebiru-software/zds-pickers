import { nanoid } from 'nanoid'
import { CURRENT_CLIENT_VERSION } from '../midi'
import { createReducer } from './utils'
import actionTypes from './actionTypes'
import { actions as userActions } from './user'

export const actions = {
  checkVersion: () => ({
    type: actionTypes.GET_SYSEX_VERSION,
    serialNumber: nanoid(),
  }),

  checkModel: () => ({
    type: actionTypes.GET_SYSEX_MODEL,
  }),

  receivedVersion: (firmware, serialNumber) => (dispatch) => {
    dispatch({
      type: actionTypes.RECEIVED_VERSION,
      firmware,
      serialNumber,
    })

    return dispatch(userActions.checkRegistration(serialNumber, firmware))
  },

  receivedModel: proModel => ({
    type: actionTypes.RECEIVED_MODEL,
    proModel,
  }),
}

const defaultState = {
  checking: false,
  checked: false,
  proModel: false,
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

const receivedModel = (state, { proModel }) => ({
  ...state,
  proModel,
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
  [actionTypes.RECEIVED_MODEL]: receivedModel,
})
