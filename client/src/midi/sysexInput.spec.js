import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import processMidiMessage from './sysexInput'
import {
  SYSEX_END,
  SYSEX_MSG_AVAILABILITY,
  SYSEX_MSG_BACKUP,
  SYSEX_MSG_GET_STATE,
  SYSEX_MSG_RECEIVE_MODEL,
  SYSEX_MSG_RECEIVE_VERSION,
  SYSEX_MSG_SEND_CONTROLS,
  SYSEX_MSG_SEND_GROUPS,
  SYSEX_START,
  marshalMSB,
} from './sysex'
import { SHIFTER_DEVICE_ID } from './index'

describe('sysexInput processing', () => {
  let data
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares)
  const store = mockStore({})
  const deviceId = SHIFTER_DEVICE_ID

  const msg = (msgType, ...packet) => [SYSEX_START, deviceId, 11, ...marshalMSB([msgType, ...packet]), SYSEX_END]

  beforeEach(store.clearActions)

  // it('should return current version if not a match', () => {
  //   const serialNumber = [...Array(11)].map(() => 49)
  //   data = [SYSEX_START, deviceId, 11, 0, SYSEX_MSG_RECEIVE_VERSION, ...serialNumber, 0, 0, 0, SYSEX_END]

  //   processMidiMessage(store.dispatch, { data })
  //   expect(store.getActions()).toHaveLength(1)
  // })

  // it('should fail gracefully if not a match', () => {
  //   const serialNumber = [...Array(11)].map(() => 49)
  //   data = [SYSEX_START, deviceId, SYSEX_MSG_RECEIVE_VERSION, 1, 0, ...serialNumber, 0, 0, 0, SYSEX_END]
  //   expect(() => processMidiMessage(store.dispatch, { data })).toThrow('Unknown SysEx message received:')
  //   expect(store.getActions()).toHaveLength(0)
  // })

  it('should test SYSEX_MSG_RECEIVE_VERSION', () => {
    /*
     * serial numbers are up to 14 chars long
     * they may be padded with zeros at the end, which are later trimmed
     */
    const serialNumber = [...Array(11)].map(() => 49)
    data = msg(SYSEX_MSG_RECEIVE_VERSION, 11, ...serialNumber, 0, 0, 0)

    processMidiMessage(store.dispatch, { data })

    expect(store.getActions()).toEqual([
      {
        type: 'RECEIVED_VERSION',
        firmware: 11,
        serialNumber: '11111111111',
      },
    ])
  })

  it('should work for SYSEX_MSG_RECEIVE_MODEL', () => {
    processMidiMessage(store.dispatch, { data: msg(SYSEX_MSG_RECEIVE_MODEL) })

    expect(store.getActions()).toEqual([{ proModel: false, type: 'RECEIVED_MODEL' }])
  })

  it('should work for SYSEX_MSG_SEND_CONTROLS', () => {
    const controls = [186, 110, 0, 0, 127]
    processMidiMessage(store.dispatch, {
      data: msg(SYSEX_MSG_SEND_CONTROLS, ...controls),
    })

    expect(store.getActions()).toEqual([{ controlData: controls, type: 'RECEIVED_CONTROLS' }])
  })

  it('should fail gracefully for SYSEX_MSG_SEND_CONTROLS', () => {
    expect(() => {
      processMidiMessage(store.dispatch, {
        data: msg(SYSEX_MSG_SEND_CONTROLS),
      })
    }).toThrowError('Invalid or missing control data received')
  })

  it('should work for SYSEX_MSG_SEND_GROUPS', () => {
    const groups = [4, 3, 2, 1, 10, 10, 10, 10, 110, 111, 112, 113, 154, 1, 154, 1]
    processMidiMessage(store.dispatch, {
      data: msg(SYSEX_MSG_SEND_GROUPS, ...groups),
    })

    expect(store.getActions()).toEqual([{ groupData: groups, type: 'RECEIVED_GROUPS' }])
  })

  it('should fail gracefully for SYSEX_MSG_SEND_GROUPS', () => {
    expect(() => {
      processMidiMessage(store.dispatch, {
        data: msg(SYSEX_MSG_SEND_GROUPS),
      })
    }).toThrowError('Invalid or missing group data received')
  })

  it('should work for SYSEX_MSG_GET_STATE', () => {
    const packet = [1, 0, 1, 0]
    processMidiMessage(store.dispatch, { data: msg(SYSEX_MSG_GET_STATE, ...packet) })

    expect(store.getActions()).toEqual([{ packet, type: 'RECEIVED_STATE' }])
  })

  it('should work for SYSEX_MSG_AVAILABILITY', () => {
    let packet = [1, 0, 1, 0]
    processMidiMessage(store.dispatch, { data: msg(SYSEX_MSG_AVAILABILITY, ...packet) })

    expect(store.getActions()).toEqual([{ type: 'RECEIVED_AVAILABILITY', ready: true }])

    store.clearActions()

    packet = [0, 0, 1, 0]
    processMidiMessage(store.dispatch, { data: msg(SYSEX_MSG_AVAILABILITY, ...packet) })

    expect(store.getActions()).toEqual([{ type: 'RECEIVED_AVAILABILITY', ready: false }])
  })

  it('should work for SYSEX_MSG_BACKUP', () => {
    const packet = [1, 0, 1, 0]
    processMidiMessage(store.dispatch, { data: msg(SYSEX_MSG_BACKUP, ...packet) })

    expect(store.getActions()).toEqual([{ packet, type: 'EXPORT_SETTINGS_PACKET' }])
  })

  it('should fail gracefully for unknown msg types', () => {
    data = msg('???')
    expect(() => processMidiMessage(store.dispatch, { data })).toThrow('Unknown SysEx message received:')
    expect(store.getActions()).toHaveLength(0)
  })
})
