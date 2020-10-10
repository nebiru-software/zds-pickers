import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import '../../__mocks__/midi/sysexOutput'
import actionTypes from '../reducers/actionTypes'
import {
  askForBackup,
  askForControls,
  askForGroups,
  askForModel,
  askForVersion,
  performFactoryReset,
  removeShiftEntry,
  restart,
  saveShiftEntry,
  setFlags,
  transmitControls,
  transmitShiftGroupChannel,
  transmitShiftGroupValue,
} from '../midi/sysexOutput'
import sysexOutput from './sysexOutput'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const inputControls = {}
const shiftGroups = { groups: {} }
const store = mockStore({ inputControls, shiftGroups })
const { dispatch } = store
const next = jest.fn(() => 'done')

describe('fileExport middleware tests', () => {
  beforeEach(jest.restoreAllMocks)

  it('should react to GET_SYSEX_VERSION action', () => {
    const serialNumber = '12345'
    const action = { type: actionTypes.GET_SYSEX_VERSION, serialNumber }

    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(askForVersion).toHaveBeenCalledWith(dispatch, serialNumber)
  })

  it('should react to GET_SYSEX_MODEL action', () => {
    const action = { type: actionTypes.GET_SYSEX_MODEL }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(askForModel).toHaveBeenCalledWith(dispatch)
  })

  it('should react to CHANGE_CONTROL_TYPE action', () => {
    const action = { type: actionTypes.CHANGE_CONTROL_TYPE }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitControls).toHaveBeenCalledWith(dispatch, inputControls)
  })

  it('should react to CHANGE_INPUT_CONTROL_CHANNEL action', () => {
    const action = { type: actionTypes.CHANGE_INPUT_CONTROL_CHANNEL }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitControls).toHaveBeenCalledWith(dispatch, inputControls)
  })

  it('should react to CHANGE_INPUT_CONTROL_LATCHING action', () => {
    const action = { type: actionTypes.CHANGE_INPUT_CONTROL_LATCHING }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitControls).toHaveBeenCalledWith(dispatch, inputControls)
  })

  it('should react to CHANGE_INPUT_CONTROL_POLARITY action', () => {
    const action = { type: actionTypes.CHANGE_INPUT_CONTROL_POLARITY }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitControls).toHaveBeenCalledWith(dispatch, inputControls)
  })

  it('should react to CHANGE_INPUT_CONTROL_VALUE action', () => {
    const action = { type: actionTypes.CHANGE_INPUT_CONTROL_VALUE }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitControls).toHaveBeenCalledWith(dispatch, inputControls)
  })

  it('should react to CHANGE_GROUP_CHANNEL action', () => {
    const action = { type: actionTypes.CHANGE_GROUP_CHANNEL, groupId: 1, channel: 9 }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitShiftGroupChannel).toHaveBeenCalledWith(dispatch, action)
  })

  it('should react to CHANGE_GROUP_VALUE action', () => {
    const action = { type: actionTypes.CHANGE_GROUP_VALUE, groupId: 2, value: 22 }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(transmitShiftGroupValue).toHaveBeenCalledWith(dispatch, action)
  })

  it('should react to SAVE_ENTRY_EDIT action', () => {
    const action = { type: actionTypes.SAVE_ENTRY_EDIT, editQueue: {} }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(saveShiftEntry).toHaveBeenCalledWith(dispatch, action)
  })

  it('should react to REMOVE_ENTRY action', () => {
    const action = { type: actionTypes.REMOVE_ENTRY, groupId: 0, entryId: 1 }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(removeShiftEntry).toHaveBeenCalledWith(dispatch, action)
  })

  it('should react to GET_SYSEX_CONTROLS action', () => {
    const action = { type: actionTypes.GET_SYSEX_CONTROLS }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(askForControls).toHaveBeenCalledWith(dispatch)
  })

  it('should react to GET_SYSEX_GROUPS action', () => {
    const action = { type: actionTypes.GET_SYSEX_GROUPS }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(askForGroups).toHaveBeenCalledWith(dispatch)
  })

  it('should react to RESTART action', () => {
    const action = { type: actionTypes.RESTART }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(restart).toHaveBeenCalledWith(dispatch)
  })

  it('should react to FACTORY_RESET action', () => {
    const action = { type: actionTypes.FACTORY_RESET, restartToo: true }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(performFactoryReset).toHaveBeenCalledWith(dispatch, true)
  })

  it('should react to SET_FLAGS action', () => {
    const action = { type: actionTypes.SET_FLAGS }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(setFlags).toHaveBeenCalledWith(dispatch, action)
  })

  it('should react to EXPORT_SETTINGS action', () => {
    const action = { type: actionTypes.EXPORT_SETTINGS }
    expect(sysexOutput(store)(next)(action)).toEqual('done')
    expect(next).toHaveBeenCalled()
    expect(askForBackup).toHaveBeenCalledWith(dispatch)
  })
})
