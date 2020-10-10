/* eslint-disable import/order */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import actionTypes from '../reducers/actionTypes'
import { inputControls, shiftGroups } from '../../__mocks__'
import { arraySequence } from '../utils'
import fileExport from './fileExport'

jest.mock('../midi/export')
const exportMock = require('../midi/export')

const initialState = {
  shifter: { exportFilename: 'filename.txt', exportBuffer: [1, 2, 3, 4] },
  version: { firmware: 99, proModel: false },
  inputControls,
  shiftGroups,
}
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
let store = mockStore(initialState)

describe('fileExport middleware tests', () => {
  it('should react to EXPORT_SETTINGS_PACKET action', () => {
    const action = { type: actionTypes.EXPORT_SETTINGS_PACKET }
    const next = jest.fn(() => 'done')

    expect(fileExport(store)(next)(action)).toEqual('done')

    expect(next).toHaveBeenCalled()
  })

  it('should react to EXPORT_SETTINGS_PACKET action for exact package size', () => {
    const action = { type: actionTypes.EXPORT_SETTINGS_PACKET }
    const next = jest.fn(() => 'done')
    const exportBuffer = arraySequence(498)
    const output = 'some output'
    const exportFilename = 'some filename'

    exportMock.default = jest.fn(() => ({ output, exportFilename }))
    exportMock.downloadFile = jest.fn()

    store = mockStore({ ...initialState, shifter: { ...initialState.shifter, exportBuffer } })

    expect(fileExport(store)(next)(action)).toEqual('done')

    expect(next).toHaveBeenCalled()
    expect(exportMock.default).toHaveBeenCalled()
    expect(exportMock.downloadFile).toHaveBeenCalledWith(output, exportFilename)
  })
})
