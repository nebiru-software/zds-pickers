import { STATUS_NOTE_ON, assertRange, extractStatus, getStatusLabel } from 'zds-pickers'
import { SORT_BY_ALL, SORT_BY_CHANNEL, SORT_BY_MESSAGE, SORT_BY_VALUE, SORT_DESC, SORT_ON_INPUT } from '../core/consts'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

export const actions = {
  changeStatus: (groupId, isInput, status) => ({
    type: actionTypes.CHANGE_ENTRY_STATUS,
    groupId,
    isInput,
    status: assertRange(status, 127, 0),
  }),

  changeChannel: (groupId, isInput, channel) => ({
    type: actionTypes.CHANGE_ENTRY_CHANNEL,
    groupId,
    isInput,
    channel: assertRange(channel, 15, 0),
  }),

  changeValue: (groupId, isInput, value) => ({
    type: actionTypes.CHANGE_ENTRY_VALUE,
    groupId,
    isInput,
    value: assertRange(value, 127, 0),
  }),
}

const addEntry = (state, { entryId, channel = 9 }) => ({
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

const modifyField = fieldName => (state, action) => ({
  ...state,
  input: action.isInput
    ? {
      ...state.input,
      [fieldName]: action[fieldName],
    }
    : { ...state.input },
  output: action.isInput
    ? { ...state.output }
    : {
      ...state.output,
      [fieldName]: action[fieldName],
    },
})

const receivedEntry = (state, { entryId, entryData: [inputStatus, inputValue, outputStatus, outputValue] }) => ({
  ...state,
  entryId,
  input: {
    value: inputValue,
    ...extractStatus(inputStatus),
  },
  output: {
    value: outputValue,
    ...extractStatus(outputStatus),
  },
})

const compareChannel = ({ channel: a }, { channel: b }) => a - b

export const compareValue = ({ value: a }, { value: b }) => a - b

const compareStatus = ({ status: a }, { status: b }) => getStatusLabel(a).localeCompare(getStatusLabel(b))

export const compareAll = (a, b) => {
  let result = compareStatus(a, b)

  if (result === 0) {
    result = compareChannel(a, b)
  }

  if (result === 0) {
    result = compareValue(a, b)
  }
  return result
}

export const compareEntry = (sortOn, sortBy, sortDir) => ({ input: ai, output: ao }, { input: bi, output: bo }) => {
  let result
  let a
  let b
  if (sortOn === SORT_ON_INPUT) {
    a = ai
    b = bi
  } else {
    a = ao
    b = bo
  }

  switch (sortBy) {
  case SORT_BY_ALL:
    result = compareAll(a, b)
    break
  case SORT_BY_CHANNEL:
    result = compareChannel(a, b)
    break
  case SORT_BY_MESSAGE:
    result = compareStatus(a, b)
    break
  case SORT_BY_VALUE:
    result = compareValue(a, b)
    break
    // istanbul ignore next
  default:
    break
  }

  if (sortDir === SORT_DESC) {
    result = -result
  }

  return result
}

export default createReducer(
  {},
  {
    [actionTypes.ADD_ENTRY]: addEntry,
    [actionTypes.CHANGE_ENTRY_STATUS]: modifyField('status'),
    [actionTypes.CHANGE_ENTRY_CHANNEL]: modifyField('channel'),
    [actionTypes.CHANGE_ENTRY_VALUE]: modifyField('value'),
    [actionTypes.RECEIVED_ENTRY]: receivedEntry,
  },
)
