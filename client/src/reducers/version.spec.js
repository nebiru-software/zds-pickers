import deepFreeze from 'deep-freeze'
import shortid from 'shortid'
import { CURRENT_CLIENT_VERSION } from '../midi'
import version, { actions } from './version'
import actionTypes from './actionTypes'

describe('version reducer', () => {
  const initialState = {
    checking: false,
    checked: false,
    proModel: false,
    client: CURRENT_CLIENT_VERSION,
    firmware: NaN,
  }
  deepFreeze(initialState)

  it('checkingVersion success', () => {
    const action = {
      type: actionTypes.GET_SYSEX_VERSION,
    }
    expect(version(initialState, action)).toEqual({
      ...initialState,
      checking: true,
      checked: false,
    })
  })

  it('receivedVersion success', () => {
    const action = {
      type: actionTypes.RECEIVED_VERSION,
      firmware: 33,
      serialNumber: '',
    }
    expect(version(initialState, action)).toEqual({
      ...initialState,
      checking: false,
      checked: true,
      firmware: 33,
    })
  })

  it('receivedModel success', () => {
    const action = { type: actionTypes.RECEIVED_MODEL, proModel: true }
    expect(version(initialState, action)).toEqual({
      ...initialState,
      proModel: true,
    })
  })

  it('shifterMissing success', () => {
    const action = { type: actionTypes.SHIFTER_MISSING }
    expect(version({ ...initialState, checking: true, checked: true }, action)).toEqual({
      ...initialState,
      checking: false,
      checked: false,
    })
  })

  describe('actions', () => {
    it('checkVersion success', () => {
      const result = actions.checkVersion()
      expect(result.type).toEqual(actionTypes.GET_SYSEX_VERSION)
      // serialNumber will be random.  Just check that it's valid
      expect(shortid.isValid(result.serialNumber)).toBeTruthy()
    })

    it('checkModel success', () => {
      expect(actions.checkModel()).toEqual({ type: actionTypes.GET_SYSEX_MODEL })
    })

    it('receivedModel success', () => {
      const proModel = true

      expect(actions.receivedModel(proModel)).toEqual({ type: actionTypes.RECEIVED_MODEL, proModel })
    })
  })
})
