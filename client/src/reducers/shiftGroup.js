/* eslint-disable no-plusplus, no-mixed-operators */
import React from 'react'
import shallowEqual from 'shallowequal'
import { statuses } from 'zds-pickers'
import { omit } from '../core/fp/objects'
import { chunk } from '../core/fp/arrays'
import InputStatusIcon from '../components/InputStatusIcon'
import { SORT_ASC, SORT_BY_ALL, SORT_ON_INPUT } from '../core/consts'
import { createReducer } from './utils'
import actionTypes from './actionTypes'
import shiftEntry from './shiftEntry'

const defaultState = {
  active: false,
  editing: false,
  editQueue: {
    entryId: -1,
    input: {
      channel: 9,
      status: 9,
      value: 0,
    },
    output: {
      channel: 9,
      status: 9,
      value: 0,
    },
  },
  /**
   * Do not confuse selectedEntryId and selectedRows
   *
   * selectedEntryId is the item being edited
   * selectedRows is used for multiple selection and drag and drop
   */
  selectedEntryId: NaN,
  selectedRows: [],
  sortOn: SORT_ON_INPUT,
  sortBy: SORT_BY_ALL,
  sortDir: SORT_ASC,
}

const modifyField = fieldName => (state, action) => ({
  ...state,
  [fieldName]: action[fieldName],
})

const addEntry = (state, action) => ({
  ...state,
  editQueue: shiftEntry({}, { ...action, channel: state.channel, entryId: -1 }),
  editing: true,
})

const removeEntry = (state, { entryId: removeEntryId }) => {
  let newState = {
    ...state,
    selectedEntryId: NaN,
    selectedRows: [],
  }

  if (Array.isArray(removeEntryId)) {
    newState = {
      ...newState,
      entries: state.entries
        .filter(({ entryId }) => !removeEntryId.includes(entryId))
        // Realign ids to indexes
        .map((entry, idx) => ({ ...entry, entryId: idx })),
    }
  } else {
    newState = {
      ...newState,
      entries: state.entries
        .filter(({ entryId }) => entryId !== removeEntryId)
        // Realign ids to indexes
        .map((entry, idx) => ({ ...entry, entryId: idx })),
    }
  }

  return newState
}

const editEntry = (state, { editEntryIdx }) => ({
  ...state,
  editQueue: state.entries.filter(({ entryId }) => entryId === editEntryIdx)[0],
  editing: true,
})

const saveEdit = (state, { editQueue }) => {
  const localEditQueue = editQueue || state.editQueue
  const { entries } = state
  const { entryId } = localEditQueue
  return {
    ...state,
    editing: false,
    selectedEntryId: entryId === -1 ? entries.length : entryId,
    selectedRows: [entryId === -1 ? entries.length : entryId],
    entries:
      entryId === -1 // Adding new entry
        ? [...entries, { ...localEditQueue, entryId: entries.length }]
        : entries // Editing existing entry
          .map(entry => (entry.entryId === entryId ? { ...localEditQueue } : entry)),
  }
}

const cancelEdit = state => ({
  ...state,
  editing: false,
})

const passThrough = (state, action) => ({
  ...state,
  editQueue: shiftEntry(state.editQueue, action),
})

const receivedGroup = (state, { entries }) => ({
  ...defaultState,
  ...state,
  entries: chunk(4)(entries).map((
    entryData,
    entryId, //
  ) => shiftEntry({}, { type: actionTypes.RECEIVED_ENTRY, entryId, entryData })),
})

const changeGroupSort = (state, { sortOn, sortBy }) => {
  const newState = {
    ...state,
    sortOn,
    sortBy,
  }

  // selectedEntryId can be NaN, which is never equal to another NaN
  const ignoreForEquivalence = omit('selectedEntryId')

  if (shallowEqual(ignoreForEquivalence(state), ignoreForEquivalence(newState))) {
    // If there was no change then assume user clicked an already sorted col.
    // Toggle the sort direction.
    newState.sortDir = 1 - newState.sortDir
  } else {
    newState.sortDir = SORT_ASC
  }
  return newState
}

const selectShiftEntry = (state, { selectedEntryId }) => ({
  ...state,
  selectedEntryId,
  selectedRows: [selectedEntryId],
})

const metaSelectEntry = (state, { meta, shift, sortedIds, idx }) => {
  let selectedRows = [...state.selectedRows]
  const entryId = sortedIds[idx]
  let i

  if (meta) {
    // Add or remove the item from selected, but keep existing items
    if (selectedRows.includes(entryId)) {
      selectedRows = selectedRows.filter(id => id !== entryId)
    } else {
      selectedRows.push(entryId)
    }
  } else if (shift && selectedRows.length === 1) {
    // If only a single item is selected, select all the items in between
    const start = sortedIds.indexOf(selectedRows[0])
    const end = sortedIds.indexOf(entryId)
    let loopEntryId
    i = start
    while (i !== end) {
      if (i > end) {
        i -= 1
      } else {
        i += 1
      }
      loopEntryId = sortedIds[i]

      /* istanbul ignore else */
      if (selectedRows.indexOf(loopEntryId) === -1) {
        selectedRows.push(loopEntryId)
      }
    }
  }

  return { ...state, selectedRows, selectedEntryId: NaN }
}

const selectAll = state => ({
  ...state,
  selectedRows: state.entries.map(({ entryId }) => entryId),
})

const selectNone = state => ({
  ...state,
  selectedRows: [],
  selectedEntryId: NaN,
})

export const gridFriendlyData = ({ input, output }) => ({
  input: {
    ...input,
    statusLabel: statuses.reduce((acc, { label, value }) => (value === input.status ? label : acc), ''),
    channel: input.channel,
  },
  output: {
    ...output,
    statusLabel: statuses.reduce((acc, { label, value }) => (value === output.status ? label : acc), ''),
    channel: output.channel,
  },
  indicator: <InputStatusIcon {...input} />,
})

export default createReducer(defaultState, {
  [actionTypes.CHANGE_GROUP_CHANNEL]: modifyField('channel'),
  [actionTypes.CHANGE_GROUP_VALUE]: modifyField('value'),
  [actionTypes.ADD_ENTRY]: addEntry,
  [actionTypes.REMOVE_ENTRY]: removeEntry,
  [actionTypes.EDIT_ENTRY]: editEntry,
  [actionTypes.SAVE_ENTRY_EDIT]: saveEdit,
  [actionTypes.CANCEL_ENTRY_EDIT]: cancelEdit,
  [actionTypes.CHANGE_ENTRY_STATUS]: passThrough,
  [actionTypes.CHANGE_ENTRY_CHANNEL]: passThrough,
  [actionTypes.CHANGE_ENTRY_VALUE]: passThrough,
  [actionTypes.RECEIVED_GROUP]: receivedGroup,
  [actionTypes.SORT_GROUP]: changeGroupSort,
  [actionTypes.SELECT_SHIFT_ENTRY]: selectShiftEntry,
  [actionTypes.SELECT_ALL_ENTRIES]: selectAll,
  [actionTypes.CLEAR_ALL_SELECTIONS]: selectNone,
  [actionTypes.ENTRY_META_CLICKED]: metaSelectEntry,
})
