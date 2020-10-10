import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import deepFreeze from 'deep-freeze'
import { STATUS_CONTROL_CHANGE } from 'zds-pickers'
import { SHIFTER_CC_MESSAGE } from '../midi'
import inputControls, { actions } from './inputControls'
import actionTypes from './actionTypes'

describe('inputControls reducer', () => {
  const initialState = [
    {
      controlId: 0,
      channel: 10,
      calibrationLow: 0,
      calibrationHigh: 127,
      curve: 0,
      polarity: 0,
      latching: 0,
      status: STATUS_CONTROL_CHANGE,
      value: SHIFTER_CC_MESSAGE,
      active: false,
      lit: false,
    },
    {
      controlId: 1,
      channel: 10,
      calibrationLow: 0,
      calibrationHigh: 127,
      curve: 0,
      polarity: 0,
      latching: 1,
      status: STATUS_CONTROL_CHANGE,
      value: SHIFTER_CC_MESSAGE,
      active: false,
      lit: false,
    },
  ]
  deepFreeze(initialState)

  it('changeChannel success', () => {
    const action = {
      type: actionTypes.CHANGE_INPUT_CONTROL_CHANNEL,
      controlId: 1,
      channel: 5,
    }
    expect(inputControls(initialState, action)).toEqual([{ ...initialState[0] }, { ...initialState[1], channel: 5 }])
  })

  it('changeLatching success', () => {
    const action = {
      type: actionTypes.CHANGE_INPUT_CONTROL_LATCHING,
      controlId: 1,
      latching: 1,
    }
    expect(inputControls(initialState, action)).toEqual([{ ...initialState[0] }, { ...initialState[1], latching: 1 }])
  })

  it('changePolarity success', () => {
    const action = {
      type: actionTypes.CHANGE_INPUT_CONTROL_POLARITY,
      controlId: 0,
      polarity: 1,
    }
    expect(inputControls(initialState, action)).toEqual([{ ...initialState[0], polarity: 1 }, { ...initialState[1] }])
  })

  it('changeValue success', () => {
    const action = {
      type: actionTypes.CHANGE_INPUT_CONTROL_VALUE,
      controlId: 1,
      value: 111,
    }
    expect(inputControls(initialState, action)).toEqual([{ ...initialState[0] }, { ...initialState[1], value: 111 }])
  })

  it('handleShifterUnplugged success', () => {
    expect(inputControls(initialState, { type: actionTypes.SHIFTER_MISSING })).toEqual([])
  })

  it('receivedControls success', () => {
    const controlData = [
      186,
      110,
      0,
      0,
      127,
      186,
      111,
      1,
      0,
      127,
      154,
      110,
      0,
      0,
      127,
      154,
      110,
      0,
      0,
      127,
      154,
      110,
      0,
      0,
      127,
      154,
      110,
      0,
      0,
      127,
    ]

    expect(inputControls(initialState, {
      type: actionTypes.RECEIVED_CONTROLS,
      controlData: [],
    })).toEqual([])

    expect(inputControls(initialState, {
      type: actionTypes.RECEIVED_CONTROLS,
      controlData,
    })).toEqual([
      {
        calibrationHigh: 127,
        calibrationLow: 0,
        channel: 10,
        controlId: 0,
        curve: 0,
        latching: 0,
        polarity: 0,
        status: 11,
        value: 110,
        active: false,
        lit: false,
      },
      {
        calibrationHigh: 127,
        calibrationLow: 0,
        channel: 10,
        controlId: 1,
        curve: 0,
        latching: 1,
        polarity: 0,
        status: 11,
        value: 111,
        active: false,
        lit: false,
      },
      {
        calibrationHigh: 127,
        calibrationLow: 0,
        channel: 10,
        controlId: 2,
        curve: 0,
        latching: 0,
        polarity: 0,
        status: 9,
        value: 110,
        active: false,
        lit: false,
      },
      {
        calibrationHigh: 127,
        calibrationLow: 0,
        channel: 10,
        controlId: 3,
        curve: 0,
        latching: 0,
        polarity: 0,
        status: 9,
        value: 110,
        active: false,
        lit: false,
      },
      {
        calibrationHigh: 127,
        calibrationLow: 0,
        channel: 10,
        controlId: 4,
        curve: 0,
        latching: 0,
        polarity: 0,
        status: 9,
        value: 110,
        active: false,
        lit: false,
      },
      {
        calibrationHigh: 127,
        calibrationLow: 0,
        channel: 10,
        controlId: 5,
        curve: 0,
        latching: 0,
        polarity: 0,
        status: 9,
        value: 110,
        active: false,
        lit: false,
      },
    ])
  })

  it('receivedInternalState success', () => {
    const action = {
      type: actionTypes.RECEIVED_STATE,
      packet: [6, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    }
    expect(inputControls(initialState, action)).toEqual([
      { ...initialState[0], active: true },
      { ...initialState[1], active: true, lit: true },
    ])
  })

  describe('actions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({})

    beforeEach(() => store.clearActions())

    it('askForControls success', () => {
      store.dispatch(actions.askForControls())

      expect(store.getActions()).toEqual([{ type: actionTypes.GET_SYSEX_CONTROLS }])
    })

    it('receivedControls success', () => {
      const controlData = [1, 2, 3]
      store.dispatch(actions.receivedControls(controlData))

      expect(store.getActions()).toEqual([{ type: actionTypes.RECEIVED_CONTROLS, controlData }])
    })

    it('changeControlType success', () => {
      store.dispatch(actions.changeControlType())

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_CONTROL_TYPE }])
    })

    it('changeInputControlChannel success', () => {
      const controlId = 1
      const channel = 3
      store.dispatch(actions.changeInputControlChannel(controlId, channel))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_INPUT_CONTROL_CHANNEL, controlId, channel }])
    })

    it('changeInputControlLatching success', () => {
      const controlId = 1
      const latching = 0
      store.dispatch(actions.changeInputControlLatching(controlId, latching))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_INPUT_CONTROL_LATCHING, controlId, latching }])
    })

    it('changeInputControlPolarity success', () => {
      const controlId = 1
      const polarity = 1
      store.dispatch(actions.changeInputControlPolarity(controlId, polarity))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_INPUT_CONTROL_POLARITY, controlId, polarity }])
    })

    it('changeInputControlValue success', () => {
      const controlId = 1
      const value = 127
      store.dispatch(actions.changeInputControlValue(controlId, value))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_INPUT_CONTROL_VALUE, controlId, value }])
    })

    it('receivedInternalState success', () => {
      const packet = { 0: 'data' }
      store.dispatch(actions.receivedInternalState(packet))

      expect(store.getActions()).toEqual([{ type: actionTypes.RECEIVED_STATE, packet }])
    })
  })
})
