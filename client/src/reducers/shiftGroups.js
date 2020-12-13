import { assertRange } from 'zds-pickers'
import { arraySequence, chunk, splitAt } from '../core/fp/arrays'
import { sum } from '../core/fp/numbers'
import { GROUP_SIZE_BYTES, MAX_ENTRIES, MAX_GROUPS } from '../core/consts'
import { createReducer } from './utils'
import shiftGroup from './shiftGroup'
import actionTypes from './actionTypes.js'

export const actions = {
  askForGroups: () => ({
    type: actionTypes.GET_SYSEX_GROUPS,
  }),

  receivedGroups: groupData => ({
    type: actionTypes.RECEIVED_GROUPS,
    groupData,
  }),

  changeSelectedGroup: groupId => ({
    type: actionTypes.CHANGE_SELECTED_GROUP,
    groupId,
  }),

  changeGroupChannel: (groupId, channel) => ({
    type: actionTypes.CHANGE_GROUP_CHANNEL,
    groupId,
    channel: assertRange(channel, 15, 0),
  }),

  changeGroupValue: (groupId, value) => ({
    type: actionTypes.CHANGE_GROUP_VALUE,
    groupId,
    value: assertRange(value, 127, 0),
  }),

  editEntry: (groupId, editEntryIdx) => ({
    type: actionTypes.EDIT_ENTRY,
    groupId,
    editEntryIdx,
  }),

  addEntry: groupId => ({
    type: actionTypes.ADD_ENTRY,
    groupId,
  }),

  saveEntryEdit: (groupId, editQueue) => ({
    type: actionTypes.SAVE_ENTRY_EDIT,
    groupId,
    editQueue,
  }),

  cancelEntryEdit: groupId => ({
    type: actionTypes.CANCEL_ENTRY_EDIT,
    groupId,
  }),

  removeEntry: (groupId, entryId) => ({
    type: actionTypes.REMOVE_ENTRY,
    groupId,
    entryId,
  }),

  changeSort: (groupId, sortOn, sortBy) => ({
    type: actionTypes.SORT_GROUP,
    groupId,
    sortOn,
    sortBy,
  }),

  selectShiftEntry: (groupId, selectedEntryId) => ({
    type: actionTypes.SELECT_SHIFT_ENTRY,
    groupId,
    selectedEntryId,
  }),

  selectAllEntries: groupId => ({
    type: actionTypes.SELECT_ALL_ENTRIES,
    groupId,
  }),

  clearAllSelections: groupId => ({
    type: actionTypes.CLEAR_ALL_SELECTIONS,
    groupId,
  }),

  handleEntryClick: (groupId, sortedIds, idx, meta, shift) => ({
    type: actionTypes.ENTRY_META_CLICKED,
    groupId,
    sortedIds,
    idx,
    meta,
    shift,
  }),
}

const defaultState = {
  selectedGroupIdx: 0,
  maxEntries: MAX_ENTRIES,
  totalEntries: 0,
  groups: [],
}

const passThrough = (state, action) => ({
  ...state,

  groups: state.groups.map(group => (group.groupId === action.groupId ? shiftGroup(group, action) : { ...group })),
})

const changeSelectedGroup = (state, { groupId }) => ({
  ...state,
  selectedGroupIdx: groupId,
})

const addRemoveEntry = (state, action) => {
  const newState = { ...passThrough(state, action) }
  return {
    ...newState,
    totalEntries: newState.groups.reduce((acc, group) => acc + group.entries.length, 0),
  }
}

const handleShifterUnplugged = () => ({
  ...defaultState,
})

const receivedGroups = (state, { groupData }) => {
  const [preamble, rest] = splitAt(MAX_GROUPS * GROUP_SIZE_BYTES)(groupData)

  const [numEntries, channels, values] = chunk(MAX_GROUPS)(preamble)

  const groups = arraySequence(MAX_GROUPS).map((val, groupId) => ({
    groupId,
    channel: channels[groupId],
    value: values[groupId],
    label: `Group ${String.fromCharCode(65 + groupId)}`,
  }))

  return {
    ...state,
    totalEntries: sum(...numEntries),
    groups: groups.map((
      group,
      idx, //
    ) => shiftGroup(group, {
      type: actionTypes.RECEIVED_GROUP, //
      entries: rest.splice(0, numEntries[idx] * MAX_GROUPS),
    })),
  }
}

const receivedInternalState = (state, { packet }) => {
  const [numControls, ...rest] = packet
  rest.pop() // Settings flag

  const active = rest.slice(numControls * 2)

  return {
    ...state,
    groups: state.groups.map((group, idx) => ({ ...group, active: Boolean(active[idx]) })),
  }
}

export default createReducer(defaultState, {
  [actionTypes.CHANGE_SELECTED_GROUP]: changeSelectedGroup,
  [actionTypes.CHANGE_GROUP_CHANNEL]: passThrough,
  [actionTypes.CHANGE_GROUP_VALUE]: passThrough,
  [actionTypes.ADD_ENTRY]: passThrough,
  [actionTypes.EDIT_ENTRY]: passThrough,
  [actionTypes.SAVE_ENTRY_EDIT]: addRemoveEntry,
  [actionTypes.CANCEL_ENTRY_EDIT]: passThrough,
  [actionTypes.REMOVE_ENTRY]: addRemoveEntry,
  [actionTypes.CHANGE_ENTRY_STATUS]: passThrough,
  [actionTypes.CHANGE_ENTRY_CHANNEL]: passThrough,
  [actionTypes.CHANGE_ENTRY_VALUE]: passThrough,
  [actionTypes.SHIFTER_MISSING]: handleShifterUnplugged,
  [actionTypes.FACTORY_RESET]: handleShifterUnplugged,
  [actionTypes.RECEIVED_GROUPS]: receivedGroups,
  [actionTypes.SORT_GROUP]: passThrough,
  [actionTypes.SELECT_SHIFT_ENTRY]: passThrough,
  [actionTypes.RECEIVED_STATE]: receivedInternalState,
  [actionTypes.SELECT_ALL_ENTRIES]: passThrough,
  [actionTypes.CLEAR_ALL_SELECTIONS]: passThrough,
  [actionTypes.ENTRY_META_CLICKED]: passThrough,
})
