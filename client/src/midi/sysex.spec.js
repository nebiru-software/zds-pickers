import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import deepFreeze from 'deep-freeze'
import actionTypes from '../reducers/actionTypes'
import { actions as versionActions } from '../reducers/version'
import productInstance from '../../__mocks__/productInstance'
import { marshalMSB, parseMSB } from './sysex'

describe('sysex processing', () => {
  it('should pack and unpack streams correctly', () => {
    const header = [240, 108, 10]
    const footer = [247]
    const original = [4, 185, 110, 0, 0, 127, 185, 5, 1, 0, 127]
    deepFreeze(original)

    const packed = [...header, ...marshalMSB(original), ...footer]
    const unpacked = parseMSB(packed)

    expect(unpacked).toEqual([...header, ...original])
  })

  it('should handle zero-length streams correctly', () => {
    expect(marshalMSB()).toHaveLength(0)
  })

  describe('sysex actions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const store = mockStore({})

    beforeEach(() => store.clearActions())

    it('receivedVersion success', () => {
      const firmware = 10
      const serialNumber = '3er4ddfere'

      fetch.mockResponse(JSON.stringify(productInstance))

      store.dispatch(versionActions.receivedVersion(firmware, serialNumber)).then(() => {
        const expectedActions = store.getActions()
        expect(expectedActions.length).toBe(2)
        expect(expectedActions[0]).toEqual({ firmware, serialNumber, type: actionTypes.RECEIVED_VERSION })
        expect(expectedActions[1]).toEqual({ type: actionTypes.CHECKED_REGISTRATION, productInstance })
      })
    })
  })
})
