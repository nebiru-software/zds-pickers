/* eslint-disable no-bitwise */
import { submit } from 'redux-form'
import { createReducer } from '../utils'
import { ACTIVITY_LED_MODE_ALWAYS_OFF } from '../midi/sysex'
import actionTypes from './actionTypes'

export const actions = {
  searchedForShifter: () => ({
    type: actionTypes.SEARCHED_FOR_SHIFTER,
  }),

  shifterFound: () => ({
    type: actionTypes.SHIFTER_FOUND,
  }),

  shifterMissing: () => ({
    type: actionTypes.SHIFTER_MISSING,
  }),

  testInterfaceFound: () => ({
    type: actionTypes.TEST_INTERFACE_FOUND,
  }),

  testInterfaceMissing: () => ({
    type: actionTypes.TEST_INTERFACE_MISSING,
  }),

  notResponding: () => ({
    type: actionTypes.NOT_RESPONDING,
  }),

  midiInActivityChanged: midiInActivity => ({
    type: actionTypes.MIDI_IN_ACTIVITY,
    midiInActivity,
  }),

  midiOutActivityChanged: midiOutActivity => ({
    type: actionTypes.MIDI_OUT_ACTIVITY,
    midiOutActivity,
  }),

  confirmFactoryReset: showResetDialog => ({
    type: actionTypes.CONFIRM_FACTORY_RESET,
    showResetDialog,
  }),

  showExportDialog: exportDialogVisible => ({
    type: actionTypes.SHOW_EXPORT_DIALOG,
    exportDialogVisible,
  }),

  submitExportForm: () => (dispatch) => {
    dispatch(submit('exportSettingsForm'))
  },

  exportSettings: ({ exportFilename }) => ({
    type: actionTypes.EXPORT_SETTINGS,
    exportDialogVisible: false,
    exportFilename,
  }),

  receivedExportPacket: packet => ({
    type: actionTypes.EXPORT_SETTINGS_PACKET,
    packet,
  }),

  showImportDialog: importDialogVisible => ({
    type: actionTypes.SHOW_IMPORT_DIALOG,
    importDialogVisible,
  }),

  submitImportForm: () => (dispatch) => {
    dispatch(submit('importSettingsForm'))
  },

  importSettings: File => ({
    type: actionTypes.IMPORT_SETTINGS,
    importDialogVisible: false,
    File,
  }),

  settingsFileInvalid: reason => ({
    type: actionTypes.INVALID_SETTINGS_FILE,
    invalidSettingsFile: reason,
  }),

  acknowledgeInvalidFile: () => ({
    type: actionTypes.INVALID_SETTINGS_FILE_ACK,
  }),

  restart: () => ({
    type: actionTypes.RESTART,
  }),

  performFactoryReset: restartToo => ({
    type: actionTypes.FACTORY_RESET,
    restartToo,
  }),

  setFlags: (midiActivityLEDMode, serialMidiOutEnabled, usbMidiOutEnabled) => ({
    type: actionTypes.SET_FLAGS,
    midiActivityLEDMode,
    serialMidiOutEnabled,
    usbMidiOutEnabled,
  }),

  receivedAvailability: ready => ({
    type: actionTypes.RECEIVED_AVAILABILITY,
    ready,
  }),

  reportError: errorMessage => ({
    type: actionTypes.REPORT_ERROR,
    errorMessage,
  }),

  dismissError: () => ({
    type: actionTypes.DISMISS_ERROR,
  }),

  showHardwareTestDialog: () => ({
    type: actionTypes.SHOW_HARDWARE_TEST_DIALOG,
  }),

  hideHardwareTestDialog: () => ({
    type: actionTypes.HIDE_HARDWARE_TEST_DIALOG,
  }),
}

export const defaultState = {
  accessGranted: false,
  errorMessage: '',
  errorVisible: false,
  exportBuffer: [],
  exportDialogVisible: false,
  exportFilename: localStorage.getItem('exportFilename') || 'zds-shifter-backup.txt',
  found: false,
  hardwareTestVisible: false,
  importDialogVisible: false,
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

const showExportDialog = (state, { exportDialogVisible = true }) => ({
  ...state,
  exportDialogVisible,
  exportBuffer: [],
})

const exportSettings = (state, { exportDialogVisible, exportFilename }) => {
  localStorage.setItem('exportFilename', exportFilename)
  return {
    ...state,
    exportDialogVisible,
    exportFilename,
  }
}

const receivedExportPacket = (state, { packet }) => ({
  ...state,
  exportBuffer: [...state.exportBuffer, ...packet],
})

const showImportDialog = (state, { importDialogVisible = true }) => ({
  ...state,
  importDialogVisible,
})

const importSettings = state => ({
  ...state,
  importDialogVisible: false,
  importInProcess: true,
})

const importComplete = state => ({
  ...state,
  importInProcess: false,
})

const settingsFileInvalid = (state, { invalidSettingsFile }) => ({
  ...state,
  invalidSettingsFile,
})

const acknowledgedInvalidFile = state => ({
  ...state,
  invalidSettingsFile: null,
})

const receivedAvailability = (state, { ready }) => ({
  ...state,
  ready,
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
  [actionTypes.SHOW_EXPORT_DIALOG]: showExportDialog,
  [actionTypes.EXPORT_SETTINGS]: exportSettings,
  [actionTypes.SHOW_IMPORT_DIALOG]: showImportDialog,
  [actionTypes.IMPORT_SETTINGS]: importSettings,
  /* When importing, we know it's done for sure when we receive the updated groups.
   */
  [actionTypes.RECEIVED_GROUPS]: importComplete,
  [actionTypes.INVALID_SETTINGS_FILE]: settingsFileInvalid,
  [actionTypes.INVALID_SETTINGS_FILE_ACK]: acknowledgedInvalidFile,
  [actionTypes.RECEIVED_AVAILABILITY]: receivedAvailability,
  [actionTypes.EXPORT_SETTINGS_PACKET]: receivedExportPacket,
})
