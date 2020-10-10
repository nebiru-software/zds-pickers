import configureStore from 'redux-mock-store'
import { RECEIVE_MIDI_MESSAGE, SEND_MIDI_MESSAGE } from 'redux-midi-fork'
import { assertRange, extractStatus } from 'zds-pickers'
import sysexMiddleware from '../middleware/sysexInput'
import actionTypes from '../reducers/actionTypes'
import { SYSEX_MSG_RECEIVE_VERSION, SYSEX_START } from './sysex'
import { watchForDeviceChange } from './index'

describe('web midi integration', () => {
  const middlewares = []
  const mockStore = configureStore(middlewares)

  it('should not find a device', () => {
    const initialState = { midi: { devices: [] } }
    const action = { type: 'FAKE_ACTION_FOR_NOW' }
    const store = mockStore(initialState)
    watchForDeviceChange(store)
    store.dispatch(action)

    const actions = store.getActions()
    expect(actions).toEqual([
      { type: 'FAKE_ACTION_FOR_NOW' },
      { type: 'TEST_INTERFACE_MISSING' },
      { type: 'SEARCHED_FOR_SHIFTER' },
    ])
  })

  it('should find a device', () => {
    const initialState = {
      midi: {
        devices: [
          {
            type: 'input',
            name: 'ZDS Shifter',
          },
          {
            type: 'output',
            name: 'ZDS Shifter',
          },
        ],
      },
    }
    const action = { type: 'FAKE_ACTION_FOR_NOW' }
    const store = mockStore(initialState)
    watchForDeviceChange(store)
    store.dispatch(action)

    const actions = store.getActions()
    expect(actions).toEqual([
      action,
      { type: actionTypes.TEST_INTERFACE_MISSING },
      { type: actionTypes.SEARCHED_FOR_SHIFTER },
    ])
  })
})

describe('our custom middleware for sysex', () => {
  const middlewares = []
  const mockStore = configureStore(middlewares)
  it('should pass the intercepted action to next', () => {
    const nextArgs = []
    const fakeNext = (...args) => {
      nextArgs.push(args)
    }
    const fakeStore = {}

    const action = { type: 'FAKE_ACTION' }
    sysexMiddleware({ fakeStore })(fakeNext)(action)
    expect(nextArgs[0]).toEqual([action])
  })

  it('should handle MIDI IN messages', () => {
    const next = jest.fn()
    const action = {
      type: RECEIVE_MIDI_MESSAGE,
      payload: {
        data: [
          SYSEX_START,
          22, // device id
          22, // anvil version
          SYSEX_MSG_RECEIVE_VERSION,
          0,
          1,
        ],
      },
    }
    const fakeStore = mockStore({})
    sysexMiddleware(fakeStore)(next)(action)
    expect(next.mock.calls).toEqual([[action]])
  })

  it('should handle MIDI OUT messages', () => {
    const next = jest.fn()
    const action = { type: SEND_MIDI_MESSAGE }
    const fakeStore = mockStore({})

    sysexMiddleware(fakeStore)(next)(action)
    expect(next.mock.calls).toEqual([[action]])
  })

  it('should handle shifter being found', () => {
    const next = jest.fn()
    const action = { type: actionTypes.SHIFTER_FOUND }
    const store = { dispatch: f => f }
    sysexMiddleware(store)(next)(action)
    expect(next.mock.calls).toEqual([[action]])
  })

  it('assertRange should work', () => {
    expect(assertRange(126, 127, 0)).toEqual(126)
    expect(assertRange(130, 127, 0)).toEqual(127)
    expect(assertRange(5, 127, 10)).toEqual(10)
    expect(assertRange('5', 127, 1)).toEqual(5)
    expect(assertRange('dog', 127, 3)).toEqual(3)
    expect(assertRange(NaN, 127, 3)).toEqual(3)
  })

  it('extractStatus should work', () => {
    expect(extractStatus(12)).toEqual({ channel: 12, status: 8 })
    expect(extractStatus(0)).toEqual({ channel: 0, status: 8 })
    expect(extractStatus(17)).toEqual({ channel: 1, status: 9 })
  })
})
