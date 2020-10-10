import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import 'jest-localstorage-mock'
import deepFreeze from 'deep-freeze'
import { RECEIVE_DEVICE_LIST } from 'redux-midi-fork'
import { state as resetPacket } from '../../__assets__/zds-shifter-backup'
import { ACTIVITY_LED_MODE_NORMALLY_ON } from '../midi/sysex'
import shifter, { actions, defaultState } from './shifter'
import actionTypes from './actionTypes'

describe('shifter reducer', () => {
  const initialState = {
    ...defaultState,
    exportFilename: 'zds-shifter-backup.txt',
  }
  deepFreeze(initialState)

  it('errorReported', () => {
    const errorMessage = 'an error'
    const action = {
      type: actionTypes.REPORT_ERROR,
      errorMessage,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      errorMessage,
      errorVisible: true,
    })
  })

  it('dismissError', () => {
    const action = { type: actionTypes.DISMISS_ERROR }
    expect(shifter({ ...initialState, errorVisible: true }, action)).toEqual({
      ...initialState,
      errorVisible: false,
    })
  })

  it('searchedForShifter success', () => {
    const action = {
      type: actionTypes.SEARCHED_FOR_SHIFTER,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      searchedForShifter: true,
    })
  })

  it('shifterFound success', () => {
    const action = {
      type: actionTypes.SHIFTER_FOUND,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      found: true,
    })
  })

  it('shifterMissing success', () => {
    const action = {
      type: actionTypes.SHIFTER_MISSING,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      found: false,
      responding: true,
    })
  })

  it('testInterfaceFound success', () => {
    const action = {
      type: actionTypes.TEST_INTERFACE_FOUND,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      testInterfaceFound: true,
    })
  })

  it('testInterfaceMissing success', () => {
    const action = {
      type: actionTypes.TEST_INTERFACE_MISSING,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      testInterfaceFound: false,
    })
  })

  it('toggleHardwareTestDialog success', () => {
    const action = {
      type: actionTypes.SHOW_HARDWARE_TEST_DIALOG,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      hardwareTestVisible: true,
    })
  })

  it('notResponding success', () => {
    const action = {
      type: actionTypes.NOT_RESPONDING,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      responding: false,
    })
  })

  it('receivedDeviceList success', () => {
    const action = {
      type: RECEIVE_DEVICE_LIST,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      accessGranted: true,
    })
  })

  it('midiInActivityChanged success', () => {
    const action = {
      type: actionTypes.MIDI_IN_ACTIVITY,
      midiInActivity: true,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      midiInActivity: true,
    })
  })

  it('midiOutActivityChanged success', () => {
    const action = {
      type: actionTypes.MIDI_OUT_ACTIVITY,
      midiOutActivity: true,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      midiOutActivity: true,
    })
  })

  it('confirmFactoryReset success', () => {
    const action = {
      type: actionTypes.CONFIRM_FACTORY_RESET,
      showResetDialog: true,
    }
    expect(shifter(initialState, action)).toEqual({
      ...initialState,
      showResetDialog: true,
    })
  })

  it('resetBeingPerformed success', () => {
    expect(shifter(initialState, {
      type: actionTypes.FACTORY_RESET,
      restartToo: true,
    })).toEqual({
      ...initialState,
      resetInProcess: true,
    })

    expect(shifter(initialState, {
      type: actionTypes.FACTORY_RESET,
      restartToo: false,
    })).toEqual({
      ...initialState,
      resetInProcess: false,
    })
  })

  it('factoryResetPerformed success', () => {
    expect(shifter(
      {
        ...initialState,
        showResetDialog: true,
        resetInProcess: true,
      },
      { type: actionTypes.RECEIVED_STATE },
    )).toEqual({
      ...initialState,
    })

    expect(shifter(
      {
        ...initialState,
        showResetDialog: true,
        resetInProcess: true,
      },
      { type: actionTypes.RECEIVED_STATE, packet: resetPacket },
    )).toEqual({
      ...initialState,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_ON,
    })
  })

  it('showExportDialog success', () => {
    expect(shifter(
      {
        ...initialState,
        exportDialogVisible: false,
      },
      { type: actionTypes.SHOW_EXPORT_DIALOG },
    )).toEqual({
      ...initialState,
      exportDialogVisible: true,
    })

    expect(shifter(
      {
        ...initialState,
        exportDialogVisible: false,
      },
      { type: actionTypes.SHOW_EXPORT_DIALOG, exportDialogVisible: true },
    )).toEqual({
      ...initialState,
      exportDialogVisible: true,
    })

    expect(shifter(
      {
        ...initialState,
        exportDialogVisible: true,
      },
      { type: actionTypes.SHOW_EXPORT_DIALOG, exportDialogVisible: false },
    )).toEqual(initialState)
  })

  it('exportSettings success', () => {
    expect(shifter(
      {
        ...initialState,
        exportDialogVisible: true,
        exportFilename: null,
      },
      {
        type: actionTypes.EXPORT_SETTINGS,
        exportDialogVisible: false,
        exportFilename: 'zds-shifter-backup.txt',
      },
    )).toEqual(initialState)
  })

  it('receivedExportPacket', () => {
    expect(shifter(
      {
        ...initialState,
        exportBuffer: ['dog'],
      },
      {
        type: actionTypes.EXPORT_SETTINGS_PACKET,
        packet: resetPacket,
      },
    )).toEqual({ ...initialState, exportBuffer: ['dog', ...resetPacket] })
  })

  it('showImportDialog success', () => {
    expect(shifter(
      {
        ...initialState,
        importDialogVisible: false,
      },
      { type: actionTypes.SHOW_IMPORT_DIALOG },
    )).toEqual({
      ...initialState,
      importDialogVisible: true,
    })

    expect(shifter(
      {
        ...initialState,
        importDialogVisible: false,
      },
      { type: actionTypes.SHOW_IMPORT_DIALOG, importDialogVisible: true },
    )).toEqual({
      ...initialState,
      importDialogVisible: true,
    })

    expect(shifter(
      {
        ...initialState,
        importDialogVisible: true,
      },
      { type: actionTypes.SHOW_IMPORT_DIALOG, importDialogVisible: false },
    )).toEqual(initialState)
  })

  it('importSettings success', () => {
    expect(shifter(
      {
        ...initialState,
        importDialogVisible: true,
      },
      { type: actionTypes.IMPORT_SETTINGS },
    )).toEqual({
      ...initialState,
      importInProcess: true,
    })
  })

  it('importComplete success', () => {
    expect(shifter(
      {
        ...initialState,
        importInProcess: true,
      },
      { type: actionTypes.RECEIVED_GROUPS },
    )).toEqual(initialState)
  })

  it('settingsFileInvalid success', () => {
    expect(shifter(
      initialState, //
      { type: actionTypes.INVALID_SETTINGS_FILE, invalidSettingsFile: true },
    )).toEqual({
      ...initialState,
      invalidSettingsFile: true,
    })
  })

  it('acknowledgedInvalidFile success', () => {
    expect(shifter(
      {
        ...initialState,
        invalidSettingsFile: 'some value',
      },
      { type: actionTypes.INVALID_SETTINGS_FILE_ACK },
    )).toEqual(initialState)
  })

  it('receivedAvailability success', () => {
    expect(shifter(
      {
        ...initialState,
        ready: false,
      },
      { type: actionTypes.RECEIVED_AVAILABILITY, ready: true },
    )).toEqual({ ...initialState, ready: true })
  })

  describe('actions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const store = mockStore({})

    beforeEach(() => store.clearActions())

    it('searchedForShifter success', () => {
      store.dispatch(actions.searchedForShifter())
      expect(store.getActions()).toEqual([{ type: actionTypes.SEARCHED_FOR_SHIFTER }])
    })

    it('shifterFound success', () => {
      store.dispatch(actions.shifterFound())
      expect(store.getActions()).toEqual([{ type: actionTypes.SHIFTER_FOUND }])
    })

    it('shifterMissing success', () => {
      store.dispatch(actions.shifterMissing())
      expect(store.getActions()).toEqual([{ type: actionTypes.SHIFTER_MISSING }])
    })

    it('testInterfaceFound success', () => {
      store.dispatch(actions.testInterfaceFound())
      expect(store.getActions()).toEqual([{ type: actionTypes.TEST_INTERFACE_FOUND }])
    })

    it('notResponding success', () => {
      store.dispatch(actions.notResponding())
      expect(store.getActions()).toEqual([{ type: actionTypes.NOT_RESPONDING }])
    })

    it('midiInActivityChanged success', () => {
      const midiInActivity = true
      store.dispatch(actions.midiInActivityChanged(midiInActivity))
      expect(store.getActions()).toEqual([{ type: actionTypes.MIDI_IN_ACTIVITY, midiInActivity }])
    })

    it('midiOutActivityChanged success', () => {
      const midiOutActivity = true
      store.dispatch(actions.midiOutActivityChanged(midiOutActivity))
      expect(store.getActions()).toEqual([{ type: actionTypes.MIDI_OUT_ACTIVITY, midiOutActivity }])
    })

    it('confirmFactoryReset success', () => {
      const showResetDialog = true
      store.dispatch(actions.confirmFactoryReset(showResetDialog))

      expect(store.getActions()).toEqual([{ type: actionTypes.CONFIRM_FACTORY_RESET, showResetDialog }])
    })

    it('showExportDialog success', () => {
      const exportDialogVisible = true
      store.dispatch(actions.showExportDialog(exportDialogVisible))

      expect(store.getActions()).toEqual([{ type: actionTypes.SHOW_EXPORT_DIALOG, exportDialogVisible }])
    })

    it('submitExportForm success', () => {
      store.dispatch(actions.submitExportForm())
      expect(store.getActions()).toEqual([{ meta: { form: 'exportSettingsForm' }, type: '@@redux-form/SUBMIT' }])
    })

    it('exportSettings success', () => {
      const exportFilename = 'test.file'
      const exportDialogVisible = false
      store.dispatch(actions.exportSettings({ exportFilename }))

      expect(store.getActions()).toEqual([{ type: actionTypes.EXPORT_SETTINGS, exportFilename, exportDialogVisible }])
    })

    it('receivedExportPacket', () => {
      const packet = [1, 3, 36, 23]
      expect(actions.receivedExportPacket(packet)).toEqual({ type: actionTypes.EXPORT_SETTINGS_PACKET, packet })
    })

    it('showImportDialog success', () => {
      const importDialogVisible = true
      store.dispatch(actions.showImportDialog(importDialogVisible))

      expect(store.getActions()).toEqual([{ type: actionTypes.SHOW_IMPORT_DIALOG, importDialogVisible }])
    })

    it('submitImportForm success', () => {
      store.dispatch(actions.submitImportForm())
      expect(store.getActions()).toEqual([{ meta: { form: 'importSettingsForm' }, type: '@@redux-form/SUBMIT' }])
    })

    it('importSettings success', () => {
      const File = 'test.file'
      const importDialogVisible = false
      store.dispatch(actions.importSettings(File))

      expect(store.getActions()).toEqual([{ type: actionTypes.IMPORT_SETTINGS, File, importDialogVisible }])
    })

    it('settingsFileInvalid success', () => {
      const reason = 'something'
      store.dispatch(actions.settingsFileInvalid(reason))

      expect(store.getActions()).toEqual([{ type: actionTypes.INVALID_SETTINGS_FILE, invalidSettingsFile: reason }])
    })

    it('acknowledgeInvalidFile success', () => {
      store.dispatch(actions.acknowledgeInvalidFile())
      expect(store.getActions()).toEqual([{ type: actionTypes.INVALID_SETTINGS_FILE_ACK }])
    })

    it('restart success', () => {
      store.dispatch(actions.restart())
      expect(store.getActions()).toEqual([{ type: actionTypes.RESTART }])
    })

    it('performFactoryReset success', () => {
      const restartToo = true
      store.dispatch(actions.performFactoryReset(restartToo))
      expect(store.getActions()).toEqual([{ type: actionTypes.FACTORY_RESET, restartToo }])
    })

    it('setFlags', () => {
      const midiActivityLEDMode = 3
      const serialMidiOutEnabled = true
      const usbMidiOutEnabled = false
      expect(actions.setFlags(midiActivityLEDMode, serialMidiOutEnabled, usbMidiOutEnabled)).toEqual({
        type: actionTypes.SET_FLAGS,
        midiActivityLEDMode,
        serialMidiOutEnabled,
        usbMidiOutEnabled,
      })
    })

    it('receivedAvailability', () => {
      const ready = true
      expect(actions.receivedAvailability(ready)).toEqual({ type: actionTypes.RECEIVED_AVAILABILITY, ready })
    })

    it('reportError', () => {
      const errorMessage = 'message'
      expect(actions.reportError(errorMessage)).toEqual({ type: actionTypes.REPORT_ERROR, errorMessage })
    })

    it('dismissError', () => {
      expect(actions.dismissError()).toEqual({ type: actionTypes.DISMISS_ERROR })
    })
  })
})
