/* eslint-disable max-len */
/* eslint-disable no-bitwise */
import { ACTIVITY_LED_MODE_ALWAYS_OFF } from '../midi/sysex'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

export const actions = {
  acknowledgeInvalidFile: () => ({ type: actionTypes.INVALID_SETTINGS_FILE_ACK }),
  confirmFactoryReset: showResetDialog => ({ type: actionTypes.CONFIRM_FACTORY_RESET, showResetDialog }),
  dismissError: () => ({ type: actionTypes.DISMISS_ERROR }),
  exportSettings: exportFilename => ({ type: actionTypes.EXPORT_SETTINGS, exportFilename }),
  hideHardwareTestDialog: () => ({ type: actionTypes.HIDE_HARDWARE_TEST_DIALOG }),
  importSettings: (File, callback) => ({ type: actionTypes.IMPORT_SETTINGS, File, callback }),
  midiInActivityChanged: midiInActivity => ({ type: actionTypes.MIDI_IN_ACTIVITY, midiInActivity }),
  midiOutActivityChanged: midiOutActivity => ({ type: actionTypes.MIDI_OUT_ACTIVITY, midiOutActivity }),
  notResponding: () => ({ type: actionTypes.NOT_RESPONDING }),
  performFactoryReset: restartToo => ({ type: actionTypes.FACTORY_RESET, restartToo }),
  receivedAvailability: ready => ({ type: actionTypes.RECEIVED_AVAILABILITY, ready }),
  receivedExportPacket: packet => ({ type: actionTypes.EXPORT_SETTINGS_PACKET, packet }),
  reportError: errorMessage => ({ type: actionTypes.REPORT_ERROR, errorMessage }),
  restart: () => ({ type: actionTypes.RESTART }),
  searchedForShifter: () => ({ type: actionTypes.SEARCHED_FOR_SHIFTER }),
  setFlags: (midiActivityLEDMode, serialMidiOutEnabled, usbMidiOutEnabled) => ({
    type: actionTypes.SET_FLAGS,
    midiActivityLEDMode,
    serialMidiOutEnabled,
    usbMidiOutEnabled,
  }),
  settingsFileInvalid: reason => ({ type: actionTypes.INVALID_SETTINGS_FILE, invalidSettingsFile: reason }),
  shifterFound: deviceId => ({ type: actionTypes.SHIFTER_FOUND, deviceId }),
  shifterMissing: () => ({ type: actionTypes.SHIFTER_MISSING }),
  showHardwareTestDialog: () => ({ type: actionTypes.SHOW_HARDWARE_TEST_DIALOG }),
  testInterfaceFound: () => ({ type: actionTypes.TEST_INTERFACE_FOUND }),
  testInterfaceMissing: () => ({ type: actionTypes.TEST_INTERFACE_MISSING }),
}

export const defaultState = {
  accessGranted: false,
  errorMessage: '',
  errorVisible: false,
  exportBuffer: [],
  exportFilename: localStorage.getItem('exportFilename') || 'zds-shifter-pro-backup.txt',
  found: false,
  hardwareTestVisible: false,
  importInProcess: false,
  invalidSettingsFile: null,
  midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_OFF,
  midiInActivity: false,
  midiOutActivity: false,
  ready: false,
  resetInProcess: false,
  responding: true, // Assume responding until proven otherwise
  searchedForShifter: false,
  serialMidiOutEnabled: true,
  showResetDialog: false,
  testInterfaceFound: false,
  usbMidiOutEnabled: true,
}

const errorReported = (state, { errorMessage }) => ({
  ...state,
  errorMessage,
  errorVisible: true,
})

const dismissError = state => ({
  ...state,
  errorVisible: false,
})

const searchedForShifter = state => ({
  ...state,
  searchedForShifter: true,
})

const shifterFound = state => ({
  ...state,
  found: true,
  showResetDialog: false,
  resetInProcess: false,
})

const shifterMissing = state => ({
  ...state,
  found: false,
  responding: true, // Assume responding until proven otherwise
  showResetDialog: false,
  resetInProcess: false,
})

const testInterfaceFound = state => ({
  ...state,
  testInterfaceFound: true,
})

const testInterfaceMissing = state => ({
  ...state,
  testInterfaceFound: false,
})

const toggleHardwareTestDialog = hardwareTestVisible => state => ({
  ...state,
  hardwareTestVisible,
})

const notResponding = state => ({
  ...state,
  responding: false,
})

const responding = state => ({
  ...state,
  responding: true,
})

const receivedDeviceList = state => ({
  ...state,
  accessGranted: true, // assume we have access if device list was received
})

const midiInActivityChanged = (state, { midiInActivity }) => ({
  ...state,
  midiInActivity,
})

const midiOutActivityChanged = (state, { midiOutActivity }) => ({
  ...state,
  midiOutActivity,
})

const confirmFactoryReset = (state, { showResetDialog }) => ({
  ...state,
  showResetDialog,
})

const resetBeingPerformed = (state, { restartToo }) => ({
  ...state,
  showResetDialog: false,
  resetInProcess: restartToo,
})

const factoryResetPerformed = (state, { packet }) => {
  let { midiActivityLEDMode, serialMidiOutEnabled, usbMidiOutEnabled } = state

  if (packet) {
    const [numControls, ...rest] = packet

    // `rest` has "active" and "lit states" for all `numControls` (6) inputs, followed
    // by the "active" state for the four groups, then finally the LED mode flag
    midiActivityLEDMode = rest[numControls + numControls + 4] & 3
    serialMidiOutEnabled = Boolean(rest[numControls + numControls + 4] & 4)
    usbMidiOutEnabled = Boolean(rest[numControls + numControls + 4] & 8)
  }

  return {
    ...state,
    showResetDialog: false,
    resetInProcess: false,
    midiActivityLEDMode,
    serialMidiOutEnabled,
    usbMidiOutEnabled,
  }
}

const exportSettings = (state, { exportFilename }) => {
  localStorage.setItem('exportFilename', exportFilename)
  return {
    ...state,
    exportFilename,
  }
}

const receivedExportPacket = (state, { packet }) => ({
  ...state,
  exportBuffer: [...state.exportBuffer, ...packet],
})

const importSettings = state => ({
  ...state,
  importInProcess: true,
})

const importComplete = state => ({
  ...state,
  importInProcess: false,
})

const settingsFileInvalid = (state, { invalidSettingsFile }) => ({
  ...state,
  importInProcess: false,
  invalidSettingsFile,
})

const acknowledgedInvalidFile = state => ({
  ...state,
  importInProcess: false,
  invalidSettingsFile: null,
})

const receivedAvailability = (state, { ready }) => ({
  ...state,
  ready: ready && !state.importInProcess,
})

export default createReducer(defaultState, {
  [actionTypes.REPORT_ERROR]: errorReported,
  [actionTypes.DISMISS_ERROR]: dismissError,
  [actionTypes.SEARCHED_FOR_SHIFTER]: searchedForShifter,
  [actionTypes.SHIFTER_FOUND]: shifterFound,
  [actionTypes.SHIFTER_MISSING]: shifterMissing,
  [actionTypes.TEST_INTERFACE_FOUND]: testInterfaceFound,
  [actionTypes.TEST_INTERFACE_MISSING]: testInterfaceMissing,
  [actionTypes.SHOW_HARDWARE_TEST_DIALOG]: toggleHardwareTestDialog(true),
  [actionTypes.HIDE_HARDWARE_TEST_DIALOG]: toggleHardwareTestDialog(false),
  'redux-midi/midi/RECEIVE_DEVICE_LIST': receivedDeviceList,
  [actionTypes.MIDI_IN_ACTIVITY]: midiInActivityChanged,
  [actionTypes.MIDI_OUT_ACTIVITY]: midiOutActivityChanged,
  [actionTypes.NOT_RESPONDING]: notResponding,
  [actionTypes.RECEIVED_VERSION]: responding,

  [actionTypes.CONFIRM_FACTORY_RESET]: confirmFactoryReset,
  [actionTypes.FACTORY_RESET]: resetBeingPerformed,
  /* Instead of catching 'FACTORY_RESET', watch for the actual result
   * of the reset, which is when it exports internal state.
   */
  [actionTypes.RECEIVED_STATE]: factoryResetPerformed,
  [actionTypes.EXPORT_SETTINGS]: exportSettings,
  [actionTypes.IMPORT_SETTINGS]: importSettings,
  /* When importing, we know it's done for sure when we receive the updated groups.
   */
  [actionTypes.RECEIVED_GROUPS]: importComplete,
  [actionTypes.INVALID_SETTINGS_FILE]: settingsFileInvalid,
  [actionTypes.INVALID_SETTINGS_FILE_ACK]: acknowledgedInvalidFile,
  [actionTypes.RECEIVED_AVAILABILITY]: receivedAvailability,
  [actionTypes.EXPORT_SETTINGS_PACKET]: receivedExportPacket,
})
