import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import backup from '../../__assets__/zds-shifter-backup.json'
import { group } from '../../__mocks__/shiftGroups'
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
} from './sysexOutput'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({})

describe('sysexOutput processing', () => {
  beforeEach(store.clearActions)

  it('askForVersion should work', () => {
    askForVersion(store.dispatch, '1234567890')
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 1, 49, 50, 51, 52, 53, 54, 0, 55, 56, 57, 48, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('askForModel should work', () => {
    askForModel(store.dispatch)
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 7, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('askForControls should work', () => {
    askForControls(store.dispatch)
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 3, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('transmitControls should work', () => {
    transmitControls(store.dispatch, backup.inputControls)
    expect(store.getActions()).toMatchSnapshot()
  })

  it('askForGroups should work', () => {
    askForGroups(store.dispatch)
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 5, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('restart should work', () => {
    restart(store.dispatch)
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 125, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('performFactoryReset should work without restart', () => {
    performFactoryReset(store.dispatch, false)
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 126, 0, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('performFactoryReset should work with restart', () => {
    performFactoryReset(store.dispatch, true)
    expect(store.getActions()).toEqual([
      {
        payload: {
          data: [240, 108, 0, 126, 1, 247],
          device: -1,
          timestamp: expect.any(Number),
        },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('setFlags', () => {
    setFlags(store.dispatch, { midiActivityLEDMode: 3, serialMidiOutEnabled: true, usbMidiOutEnabled: false })
    expect(store.getActions()).toEqual([
      {
        payload: { data: [240, 108, 0, 10, 7, 247], device: -1, timestamp: 0 },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])

    store.clearActions()
    setFlags(store.dispatch, { midiActivityLEDMode: 3, serialMidiOutEnabled: false, usbMidiOutEnabled: true })
    expect(store.getActions()).toEqual([
      {
        payload: { data: [240, 108, 0, 10, 11, 247], device: -1, timestamp: 0 },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('transmitShiftGroupChannel', () => {
    transmitShiftGroupChannel(store.dispatch, { groupId: 1, channel: 9 })
    expect(store.getActions()).toEqual([
      {
        payload: { data: [240, 108, 0, 11, 1, 9, 247], device: -1, timestamp: 0 },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('transmitShiftGroupValue', () => {
    transmitShiftGroupValue(store.dispatch, { groupId: 1, channel: 9 })
    expect(store.getActions()).toEqual([
      {
        payload: { data: [240, 108, 0, 12, 1, 0, 247], device: -1, timestamp: 0 },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('removeShiftEntry - single entry', () => {
    removeShiftEntry(store.dispatch, { groupId: 1, entryId: 9 })
    expect(store.getActions()).toEqual([
      {
        payload: { data: [240, 108, 0, 14, 1, 9, 247], device: -1, timestamp: 0 },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })

  it('removeShiftEntry - multiple entries', () => {
    removeShiftEntry(store.dispatch, { groupId: 1, entryId: [3, 9] })
    expect(store.getActions()).toMatchSnapshot()
  })

  it('saveShiftEntry', () => {
    saveShiftEntry(store.dispatch, { groupId: 0, editQueue: group.entries[0] })
    expect(store.getActions()).toMatchSnapshot()
    store.clearActions()

    saveShiftEntry(store.dispatch, { groupId: 0, editQueue: { ...group.entries[1], entryId: -1 } })
    expect(store.getActions()).toMatchSnapshot()
  })

  it('askForBackup', () => {
    askForBackup(store.dispatch)
    expect(store.getActions()).toEqual([
      {
        payload: { data: [240, 108, 0, 16, 247], device: -1, timestamp: 0 },
        type: 'redux-midi/midi/SEND_MIDI_MESSAGE',
      },
    ])
  })
})
