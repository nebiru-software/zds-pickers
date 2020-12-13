import actionTypes from '../reducers/actionTypes'
import {
  askForBackup,
  askForControls,
  askForGroups,
  askForModel,
  performFactoryReset,
  removeShiftEntry,
  restart,
  saveShiftEntry,
  setFlags,
  transmitControls,
  transmitShiftGroupChannel,
  transmitShiftGroupValue,
} from '../midi/sysexOutput'

export default store => next => (action) => {
  // Allow the reducers to process the command first
  const result = next(action)

  const { dispatch, getState } = store

  // If it's an action that affects the hardware device, process it
  switch (action.type) {
  case actionTypes.GET_SYSEX_MODEL:
    askForModel(dispatch)
    break

  case actionTypes.CHANGE_CONTROL_TYPE: // Not yet used
  case actionTypes.CHANGE_INPUT_CONTROL_CHANNEL:
  case actionTypes.CHANGE_INPUT_CONTROL_LATCHING:
  case actionTypes.CHANGE_INPUT_CONTROL_POLARITY:
  case actionTypes.CHANGE_INPUT_CONTROL_VALUE:
    transmitControls(dispatch, getState().inputControls)
    break

  case actionTypes.CHANGE_GROUP_CHANNEL:
    transmitShiftGroupChannel(dispatch, action)
    break

  case actionTypes.CHANGE_GROUP_VALUE:
    transmitShiftGroupValue(dispatch, action)
    break

  case actionTypes.REMOVE_ENTRY:
    removeShiftEntry(dispatch, action)
    break

  case actionTypes.SAVE_ENTRY_EDIT:
    saveShiftEntry(dispatch, action)
    break

  case actionTypes.GET_SYSEX_CONTROLS:
    askForControls(dispatch)
    break

  case actionTypes.GET_SYSEX_GROUPS:
    askForGroups(dispatch)
    break

  case actionTypes.RESTART:
    restart(dispatch)
    break

  case actionTypes.FACTORY_RESET:
    performFactoryReset(dispatch, action.restartToo)
    break

  case actionTypes.SET_FLAGS:
    setFlags(dispatch, action)
    break

  case actionTypes.EXPORT_SETTINGS:
    askForBackup(dispatch)
    break

    // istanbul ignore next
  default:
    break
  }

  // No matter what, return the updated store state
  return result
}
