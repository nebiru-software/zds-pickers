import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import actionTypes from '../reducers/actionTypes'
import { inputControls, shiftGroups } from '../../__mocks__'
import fileImport from './fileImport'

const initialState = {
  shifter: { exportFilename: 'filename.txt' },
  version: { firmware: 99, proModel: false },
  inputControls,
  shiftGroups,
}
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore(initialState)
const next = jest.fn(() => 'done')

describe('fileImport middleware tests', () => {
  it('should fail if no file provided', () => {
    const action = { type: actionTypes.IMPORT_SETTINGS }
    const perform = () => {
      fileImport(store)(next)(action)
    }

    expect(perform).toThrow(TypeError('Must be a File or Blob'))

    expect(next).toHaveBeenCalled()
  })

  it('should react to IMPORT_SETTINGS action', () => {
    const File = new Blob([''], { type: 'text/plain' })
    const action = { type: actionTypes.IMPORT_SETTINGS, File }

    expect(fileImport(store)(next)(action)).toEqual('done')

    expect(next).toHaveBeenCalled()
  })
})
