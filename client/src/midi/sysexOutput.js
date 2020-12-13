/* eslint-disable no-bitwise */
import { sendMidiMessage } from 'redux-midi-fork'
// import now from 'performance-now'
import { combineStatus } from 'zds-pickers'
import { delay } from 'fp/utils'
import { shifterOutputId } from './devices'
import {
  SYSEX_END,
  SYSEX_MSG_BACKUP,
  SYSEX_MSG_CHANGE_GROUP_CHANNEL,
  SYSEX_MSG_CHANGE_GROUP_VALUE,
  SYSEX_MSG_FACTORY_RESET,
  SYSEX_MSG_GET_CONTROLS,
  SYSEX_MSG_GET_GROUPS,
  SYSEX_MSG_GET_MODEL,
  SYSEX_MSG_RECEIVE_FLAGS,
  SYSEX_MSG_REMOVE_ENTRY,
  SYSEX_MSG_RESTART,
  SYSEX_MSG_RESTORE,
  SYSEX_MSG_SAVE_ENTRY_EDIT,
  SYSEX_MSG_SEND_CONTROLS,
  SYSEX_START,
  marshalMSB,
} from './sysex'
import { SHIFTER_DEVICE_ID } from '.'

const reduceMidiMessage = ({ channel, status, value }) => [combineStatus(channel, status), value]

const reduceEntry = ({ input, output }) => [...reduceMidiMessage(input), ...reduceMidiMessage(output)]

const transmitAction = (command, data = []) => sendMidiMessage({
  data: [SYSEX_START, SHIFTER_DEVICE_ID, ...marshalMSB([command, ...data]), SYSEX_END],
  timestamp: 0, // performance.now(),
  device: shifterOutputId(),
})

export const askForModel = (dispatch) => {
  dispatch(transmitAction(SYSEX_MSG_GET_MODEL))
}

export const askForControls = (dispatch) => {
  dispatch(transmitAction(SYSEX_MSG_GET_CONTROLS))
}

export const transmitControls = (dispatch, controls) => {
  const data = controls.reduce((acc, control) => {
    // reduce control
    const { calibrationHigh, calibrationLow, curve, latching, polarity } = control
    const flags = Number(latching) | (Number(polarity) << 1) | (curve << 2)
    return [
      ...acc, // ==
      ...reduceMidiMessage(control),
      flags,
      calibrationLow,
      calibrationHigh,
    ]
  }, [])
  dispatch(transmitAction(SYSEX_MSG_SEND_CONTROLS, data))
}

export const askForGroups = (dispatch) => {
  dispatch(transmitAction(SYSEX_MSG_GET_GROUPS))
}

export const restart = (dispatch) => {
  dispatch(transmitAction(SYSEX_MSG_RESTART))
}

export const performFactoryReset = (dispatch, restartToo) => {
  dispatch(transmitAction(SYSEX_MSG_FACTORY_RESET, [restartToo]))
}

export const setFlags = (dispatch, { midiActivityLEDMode, serialMidiOutEnabled, usbMidiOutEnabled }) => {
  let newFlag = midiActivityLEDMode
  if (serialMidiOutEnabled) {
    newFlag |= 4
  }
  if (usbMidiOutEnabled) {
    newFlag |= 8
  }
  dispatch(transmitAction(SYSEX_MSG_RECEIVE_FLAGS, [newFlag]))
}

export const transmitShiftGroupChannel = (dispatch, { groupId, channel }) => {
  dispatch(transmitAction(SYSEX_MSG_CHANGE_GROUP_CHANNEL, [groupId, channel]))
}

export const transmitShiftGroupValue = (dispatch, { groupId, value }) => {
  dispatch(transmitAction(SYSEX_MSG_CHANGE_GROUP_VALUE, [groupId, value]))
}

export const removeShiftEntry = (dispatch, { groupId, entryId }) => {
  if (Array.isArray(entryId)) {
    entryId.forEach((id) => {
      dispatch(transmitAction(SYSEX_MSG_REMOVE_ENTRY, [groupId, id]))
      delay(100)
    })
  } else {
    dispatch(transmitAction(SYSEX_MSG_REMOVE_ENTRY, [groupId, entryId]))
  }
}

export const saveShiftEntry = (dispatch, { groupId, editQueue }) => {
  let { entryId } = editQueue
  if (entryId === -1) {
    entryId = 255
  }
  dispatch(transmitAction(SYSEX_MSG_SAVE_ENTRY_EDIT, [groupId, entryId, ...reduceEntry(editQueue)]))
}

export const askForBackup = (dispatch) => {
  dispatch(transmitAction(SYSEX_MSG_BACKUP))
}

export const transmitBackup = (dispatch, packet) => {
  dispatch(transmitAction(SYSEX_MSG_RESTORE, packet))
}
