import 'jest-localstorage-mock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { STATUS_NOTE_OFF, STATUS_NOTE_ON } from 'zds-pickers'
import shiftEntry, { actions, compareEntry } from './shiftEntry'
import actionTypes from './actionTypes'
import {
  SORT_ASC,
  SORT_BY_ALL,
  SORT_BY_CHANNEL,
  SORT_BY_MESSAGE,
  SORT_BY_VALUE,
  SORT_DESC,
  SORT_ON_INPUT,
  SORT_ON_OUTPUT,
} from './shiftGroup'

describe('shiftEntry reducer', () => {
  it('searchedForShifter success', () => {
    const entryId = 4
    const channel = 9
    expect(shiftEntry({}, { type: actionTypes.ADD_ENTRY, entryId })).toEqual({
      entryId,
      input: {
        channel,
        status: STATUS_NOTE_ON,
        value: 1,
      },
      output: {
        channel,
        status: STATUS_NOTE_ON,
        value: 1,
      },
    })

    expect(shiftEntry({}, { type: actionTypes.ADD_ENTRY, entryId, channel: 4 })).toEqual({
      entryId,
      input: {
        channel: 4,
        status: STATUS_NOTE_ON,
        value: 1,
      },
      output: {
        channel: 4,
        status: STATUS_NOTE_ON,
        value: 1,
      },
    })
  })

  it('receivedEntry success', () => {
    const entryId = 4
    const inputStatus = 10
    const inputValue = 11
    const outputStatus = 12
    const outputValue = 13
    const entryData = [inputStatus, inputValue, outputStatus, outputValue]
    expect(shiftEntry({}, { type: actionTypes.RECEIVED_ENTRY, entryId, entryData })).toEqual({
      entryId,
      input: {
        channel: 10,
        status: 8,
        value: inputValue,
      },
      output: {
        channel: 12,
        status: 8,
        value: outputValue,
      },
    })
  })

  describe('sorting tests', () => {
    const item1 = {
      channel: 10,
      status: STATUS_NOTE_ON,
      value: 0,
    }
    const item2 = {
      channel: 11,
      status: STATUS_NOTE_OFF,
      value: 1,
    }

    it('', () => {
      expect(compareEntry(SORT_ON_INPUT, SORT_BY_ALL, SORT_ASC)(
        { input: item1, output: item1 },
        { input: item2, output: item2 },
      )).toEqual(-1)

      expect(compareEntry(SORT_ON_INPUT, SORT_BY_ALL, SORT_DESC)(
        { input: item1, output: item1 },
        { input: item2, output: item2 },
      )).toEqual(1)

      expect(compareEntry(SORT_ON_INPUT, SORT_BY_CHANNEL, SORT_ASC)(
        { input: item1, output: item1 },
        { input: item2, output: item2 },
      )).toEqual(-1)

      expect(compareEntry(SORT_ON_INPUT, SORT_BY_MESSAGE, SORT_ASC)(
        { input: item1, output: item1 },
        { input: item2, output: item2 },
      )).toEqual(-1)

      expect(compareEntry(SORT_ON_INPUT, SORT_BY_VALUE, SORT_ASC)(
        { input: item1, output: item1 },
        { input: item2, output: item2 },
      )).toEqual(-1)

      expect(compareEntry(SORT_ON_OUTPUT, SORT_BY_CHANNEL, SORT_ASC)(
        { input: item1, output: item1 },
        { input: item2, output: item2 },
      )).toEqual(-1)

      expect(compareEntry(SORT_ON_INPUT, SORT_BY_ALL, SORT_ASC)(
        { input: item1, output: item2 },
        { input: item1, output: item2 },
      )).toEqual(0)
    })
  })

  describe('actions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({})

    beforeEach(() => store.clearActions())

    it('changeStatus success', () => {
      const groupId = 1
      const isInput = false
      const status = 125
      store.dispatch(actions.changeStatus(groupId, isInput, status))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_ENTRY_STATUS, groupId, isInput, status }])

      store.clearActions()
      // should truncate range
      store.dispatch(actions.changeStatus(groupId, isInput, 128))
      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_ENTRY_STATUS, groupId, isInput, status: 127 }])
    })

    it('changeChannel success', () => {
      const groupId = 1
      const isInput = false
      const channel = 8
      store.dispatch(actions.changeChannel(groupId, isInput, channel))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_ENTRY_CHANNEL, groupId, isInput, channel }])

      store.clearActions()
      // should truncate range
      store.dispatch(actions.changeChannel(groupId, isInput, 128))
      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_ENTRY_CHANNEL, groupId, isInput, channel: 15 }])
    })

    it('changeValue success', () => {
      const groupId = 1
      const isInput = false
      const value = 48
      store.dispatch(actions.changeValue(groupId, isInput, value))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_ENTRY_VALUE, groupId, isInput, value }])

      store.clearActions()
      // should truncate range
      store.dispatch(actions.changeValue(groupId, isInput, -1))
      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_ENTRY_VALUE, groupId, isInput, value: 0 }])
    })
  })
})
