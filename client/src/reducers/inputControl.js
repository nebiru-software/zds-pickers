import { STATUS_CONTROL_CHANGE } from 'zds-pickers'
import { SHIFTER_CC_MESSAGE } from '../midi'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

const defaultState = {
  controlId: 0,
  channel: 9,
  calibrationLow: 0,
  calibrationHigh: 127,
  curve: 0,
  polarity: 0,
  latching: 0,
  status: STATUS_CONTROL_CHANGE,
  value: SHIFTER_CC_MESSAGE,
  active: false,
  lit: false,
}

const modifyField = fieldName => (
  state,
  action, //
) => state.controlId === action.controlId //
  ? { ...state, [fieldName]: action[fieldName] }
  : { ...state }

export default createReducer(defaultState, {
  [actionTypes.CHANGE_INPUT_CONTROL_CALIBRATION_HIGH]: modifyField('calibrationHigh'),
  [actionTypes.CHANGE_INPUT_CONTROL_CALIBRATION_LOW]: modifyField('calibrationLow'),
  [actionTypes.CHANGE_INPUT_CONTROL_CHANNEL]: modifyField('channel'),
  [actionTypes.CHANGE_INPUT_CONTROL_LATCHING]: modifyField('latching'),
  [actionTypes.CHANGE_INPUT_CONTROL_POLARITY]: modifyField('polarity'),
  [actionTypes.CHANGE_INPUT_CONTROL_VALUE]: modifyField('value'),
})
