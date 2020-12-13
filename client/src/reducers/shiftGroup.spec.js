import deepFreeze from 'deep-freeze'
import { STATUS_NOTE_OFF, STATUS_NOTE_ON } from 'zds-pickers'
import InputStatusIcon from '../components/InputStatusIcon'
import { group, groupAEntryData } from '../../__mocks__/shiftGroups'
import shiftGroup, {
  SORT_ASC,
  SORT_BY_ALL,
  SORT_BY_MESSAGE,
  SORT_DESC,
  SORT_ON_INPUT,
  SORT_ON_OUTPUT,
  gridFriendlyData,
} from './shiftGroup'
import actionTypes from './actionTypes'

const defaultState = {
  channel: 9,
  entries: [],
  editQueue: {},
  editing: false,
  groupId: 0,
  label: 'Group A',
  value: 110,
  sortOn: SORT_ON_INPUT,
  sortBy: SORT_BY_ALL,
  sortDir: SORT_ASC,
  selectedEntryId: NaN,
  selectedRows: [],
}

deepFreeze(defaultState)

describe('shiftGroup reducer', () => {
  it('addEntry success', () => {
    const action = {
      type: actionTypes.ADD_ENTRY,
      groupId: 0,
    }
    expect(shiftGroup(defaultState, action)).toEqual({
      ...defaultState,
      entries: [],
      editing: true,
      editQueue: {
        entryId: -1,
        input: {
          channel: 9,
          status: STATUS_NOTE_ON,
          value: 1,
        },
        output: {
          channel: 9,
          status: STATUS_NOTE_ON,
          value: 1,
        },
      },
    })
  })

  it('modifyField success', () => {
    const channel = 12
    expect(shiftGroup(defaultState, { type: actionTypes.CHANGE_GROUP_CHANNEL, channel })).toEqual({
      ...defaultState,
      channel,
    })
  })

  it('removeEntry success', () => {
    expect(shiftGroup(defaultState, { type: actionTypes.REMOVE_ENTRY })).toEqual(defaultState)

    let localState = { ...defaultState } // eslint-disable-line
    localState = shiftGroup(localState, { type: actionTypes.ADD_ENTRY, groupId: 0 })
    expect(shiftGroup(localState, {
      type: actionTypes.REMOVE_ENTRY,
      groupId: 0,
      entryId: 0,
    }).entries.length).toEqual(0)
  })

  it('removeEntry (multiple entries)', () => {
    const state = { ...defaultState, entries: [...group.entries] }

    expect(shiftGroup(state, {
      type: actionTypes.REMOVE_ENTRY,
      groupId: 0,
      entryId: [2, 3],
    }).entries.length).toEqual(2)
  })

  it('editEntry success', () => {
    expect(shiftGroup(defaultState, { type: actionTypes.EDIT_ENTRY, groupId: 0, editEntryIdx: 2 })).toEqual({
      ...defaultState,
      editQueue: undefined,
      editing: true,
    })

    const withOneEntry = {
      ...defaultState,
      entries: [
        {
          entryId: 0,
          input: {
            channel: 9,
            status: STATUS_NOTE_ON,
            value: 0,
          },
          output: {
            channel: 9,
            status: STATUS_NOTE_ON,
            value: 0,
          },
        },
      ],
    }

    expect(shiftGroup(withOneEntry, { type: actionTypes.EDIT_ENTRY, groupId: 0, editEntryIdx: 0 })).toEqual({
      ...withOneEntry,
      editQueue: withOneEntry.entries[0],
      editing: true,
    })
  })

  it('modifyEntry success', () => {
    const entry = {
      entryId: 0,
      input: {
        channel: 9,
        status: STATUS_NOTE_ON,
        value: 0,
      },
      output: {
        channel: 9,
        status: STATUS_NOTE_ON,
        value: 0,
      },
    }
    deepFreeze(entry)

    const state = {
      ...defaultState,
      editing: true,
      entries: [{ ...entry }],
      editQueue: { ...entry },
    }
    deepFreeze(state)

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_STATUS,
      entryId: 0,
      status: STATUS_NOTE_OFF,
      isInput: true,
    })).toEqual({
      ...state,
      editQueue: { ...entry, input: { ...entry.input, status: STATUS_NOTE_OFF } },
    })

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_STATUS,
      entryId: 0,
      status: STATUS_NOTE_OFF,
      isInput: false,
    })).toEqual({
      ...state,
      editQueue: { ...entry, output: { ...entry.output, status: STATUS_NOTE_OFF } },
    })

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_CHANNEL,
      entryId: 0,
      channel: 8,
      isInput: true,
    })).toEqual({
      ...state,
      editQueue: { ...entry, input: { ...entry.input, channel: 8 } },
    })

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_CHANNEL,
      entryId: 0,
      channel: 8,
      isInput: false,
    })).toEqual({
      ...state,
      editQueue: { ...entry, output: { ...entry.output, channel: 8 } },
    })

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_VALUE,
      entryId: 0,
      value: 12,
      isInput: true,
    })).toEqual({
      ...state,
      editQueue: { ...entry, input: { ...entry.input, value: 12 } },
    })

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_VALUE,
      entryId: 0,
      value: 12,
      isInput: false,
    })).toEqual({
      ...state,
      editQueue: { ...entry, output: { ...entry.output, value: 12 } },
    })

    expect(shiftGroup(state, {
      type: actionTypes.CHANGE_ENTRY_VALUE,
      entryId: 1,
      value: 12,
      isInput: false,
    })).toEqual({ ...state, editQueue: { ...entry, output: { ...entry.output, value: 12 } } })
  })

  it('gridFriendlyData success', () => {
    const entry = {
      entryId: 0,
      input: {
        channel: 9,
        status: STATUS_NOTE_ON,
        value: 1,
      },
      output: {
        channel: 9,
        status: STATUS_NOTE_ON,
        value: 1,
      },
    }

    expect(gridFriendlyData(entry)).toEqual({
      indicator: <InputStatusIcon
        channel={9}
        status={9}
        value={1}
      />,
      input: { channel: 9, status: 9, statusLabel: 'Note On', value: 1 },
      output: { channel: 9, status: 9, statusLabel: 'Note On', value: 1 },
    })
  })

  it('saveEdit success', () => {
    expect(shiftGroup(
      {
        ...defaultState,
        editing: true,
        editQueue: {
          entryId: 0,
          input: {
            channel: 9,
            status: STATUS_NOTE_ON,
            value: 0,
          },
          output: {
            channel: 9,
            status: STATUS_NOTE_ON,
            value: 0,
          },
        },
      },
      { type: actionTypes.SAVE_ENTRY_EDIT },
    )).toEqual({
      channel: 9,
      editQueue: {
        entryId: 0,
        input: { channel: 9, status: 9, value: 0 },
        output: { channel: 9, status: 9, value: 0 },
      },
      selectedEntryId: 0,
      selectedRows: [0],
      editing: false,
      entries: [],
      groupId: 0,
      label: 'Group A',
      value: 110,
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
    })

    expect(shiftGroup(
      {
        ...defaultState,
        editing: true,
        editQueue: {
          entryId: -1,
          input: {
            channel: 9,
            status: STATUS_NOTE_ON,
            value: 0,
          },
          output: {
            channel: 9,
            status: STATUS_NOTE_ON,
            value: 0,
          },
        },
      },
      { type: actionTypes.SAVE_ENTRY_EDIT },
    )).toEqual({
      channel: 9,
      editQueue: {
        entryId: -1,
        input: { channel: 9, status: 9, value: 0 },
        output: { channel: 9, status: 9, value: 0 },
      },
      editing: false,
      entries: [
        {
          entryId: 0,
          input: { channel: 9, status: 9, value: 0 },
          output: { channel: 9, status: 9, value: 0 },
        },
      ],
      groupId: 0,
      label: 'Group A',
      selectedEntryId: 0,
      selectedRows: [0],
      value: 110,
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
    })

    expect(shiftGroup(
      {
        ...defaultState,
        editing: true,
        entries: [
          {
            entryId: 3,
            input: { channel: 9, status: 9, value: 0 },
            output: { channel: 9, status: 9, value: 0 },
          },
          { entryId: 2 },
        ],
        editQueue: {
          entryId: 3,
          input: {
            channel: 4,
            status: STATUS_NOTE_ON,
            value: 0,
          },
          output: {
            channel: 4,
            status: STATUS_NOTE_ON,
            value: 0,
          },
        },
      },
      { type: actionTypes.SAVE_ENTRY_EDIT },
    )).toEqual({
      channel: 9,
      editQueue: {
        entryId: 3,
        input: { channel: 4, status: 9, value: 0 },
        output: { channel: 4, status: 9, value: 0 },
      },
      editing: false,
      entries: [
        {
          entryId: 3,
          input: { channel: 4, status: 9, value: 0 },
          output: { channel: 4, status: 9, value: 0 },
        },
        { entryId: 2 },
      ],
      groupId: 0,
      label: 'Group A',
      value: 110,
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
      selectedEntryId: 3,
      selectedRows: [3],
    })
  })

  it('cancelEdit success', () => {
    expect(shiftGroup(
      { ...defaultState, editing: true }, //
      { type: actionTypes.CANCEL_ENTRY_EDIT },
    )).toEqual(defaultState)
  })

  it('receivedGroup success', () => {
    expect(shiftGroup(
      { ...defaultState }, //
      { type: actionTypes.RECEIVED_GROUP, entries: groupAEntryData },
    )).toEqual(group)
  })

  it('changeGroupSort success', () => {
    expect(shiftGroup(
      { ...defaultState }, //
      { type: actionTypes.SORT_GROUP, groupId: 0, sortOn: SORT_ON_OUTPUT, sortBy: SORT_BY_MESSAGE },
    )).toEqual({
      ...defaultState,
      sortOn: SORT_ON_OUTPUT,
      sortBy: SORT_BY_MESSAGE,
    })

    expect(shiftGroup(
      { ...defaultState }, //
      { type: actionTypes.SORT_GROUP, groupId: 0, sortOn: SORT_ON_INPUT, sortBy: SORT_BY_ALL },
    )).toEqual({
      ...defaultState,
      sortDir: SORT_DESC,
    })
  })

  describe('metaSelectEntry', () => {
    let state
    const sortedIds = [0, 1, 3, 2]
    const idx = 3
    const type = actionTypes.ENTRY_META_CLICKED
    beforeEach(() => {
      state = { ...defaultState, entries: [...group.entries] }
    })
    it('neither meta now shift pressed', () => {
      const meta = false
      const shift = false
      const action = { type, meta, shift, sortedIds, idx }
      expect(shiftGroup(state, action)).toEqual({ ...state })
    })
    it('meta pressed, new selection', () => {
      const meta = true
      const shift = false
      const action = { type, meta, shift, sortedIds, idx }
      expect(shiftGroup(state, action)).toEqual({ ...state, selectedRows: [2] })
    })
    it('meta pressed, add to selection', () => {
      const meta = true
      const shift = false
      const action = { type, meta, shift, sortedIds, idx }
      state = { ...state, selectedRows: [0] }
      expect(shiftGroup(state, action)).toEqual({ ...state, selectedRows: [0, 2] })
    })
    it('meta pressed, remove from selection', () => {
      const meta = true
      const shift = false
      const action = { type, meta, shift, sortedIds, idx }
      state = { ...state, selectedRows: [0, 2] }
      expect(shiftGroup(state, action)).toEqual({ ...state, selectedRows: [0] })
    })
    it('meta pressed, remove single selection', () => {
      const meta = true
      const shift = false
      const action = { type, meta, shift, sortedIds, idx }
      state = { ...state, selectedRows: [2] }
      expect(shiftGroup(state, action)).toEqual({ ...state, selectedRows: [] })
    })
    it('shift pressed, no rows selected', () => {
      const meta = false
      const shift = true
      const action = { type, meta, shift, sortedIds, idx }
      expect(shiftGroup(state, action)).toEqual(state)
    })
    it('shift pressed, one row selected', () => {
      const meta = false
      const shift = true
      const action = { type, meta, shift, sortedIds, idx }
      state = { ...state, selectedRows: [0] }
      expect(shiftGroup(state, action)).toEqual({ ...state, selectedRows: [0, 1, 3, 2] })
    })
    it('shift pressed, one high row selected', () => {
      const meta = false
      const shift = true
      const action = { type, meta, shift, sortedIds, idx: 0 }
      state = { ...state, selectedRows: [2] }
      expect(shiftGroup(state, action)).toEqual({ ...state, selectedRows: [2, 3, 1, 0] })
    })
  })

  it('selectShiftEntry success', () => {
    const selectedEntryId = 3
    expect(shiftGroup(
      { ...defaultState }, //
      { type: actionTypes.SELECT_SHIFT_ENTRY, selectedEntryId },
    )).toEqual({ ...defaultState, selectedEntryId, selectedRows: [selectedEntryId] })
  })

  it('selectAll', () => {
    const state = { ...defaultState, entries: [...group.entries] }
    expect(shiftGroup(state, { type: actionTypes.SELECT_ALL_ENTRIES })) //
      .toEqual({ ...state, selectedRows: [0, 1, 2, 3] })
  })

  it('selectNone', () => {
    const state = { ...defaultState, entries: [...group.entries], selectedRows: [0, 1, 2, 3] }
    expect(shiftGroup(state, { type: actionTypes.CLEAR_ALL_SELECTIONS })) //
      .toEqual({ ...state, selectedRows: [] })
  })
})
