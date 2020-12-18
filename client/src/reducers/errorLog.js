import { createReducer } from './utils'
import actionTypes from './actionTypes'

export const initialState = {
  currentMessage: undefined,
  logVisible: false,
  messages: [],
}

export const actions = {
  reportError: message => ({
    type: actionTypes.ERROR_OCCURRED,
    message,
  }),

  clearError: () => ({ type: actionTypes.ERROR_CLEAR }),

  clearAll: () => ({ type: actionTypes.ERROR_CLEAR_ALL }),

  showLog: logVisible => ({ type: actionTypes.ERROR_SHOW_LOG, logVisible }),
}

const handleError = (state, { message }) => {
  const messages = [...state.messages]
  const newMessage = String(message?.message ? message.message : message)

  if (messages.length && messages[messages.length - 1].text === newMessage) {
    messages[messages.length - 1].count += 1
  } else {
    messages.push({ text: newMessage, count: 1 })
  }

  return {
    ...state,
    currentMessage: newMessage,
    messages: [...messages],
  }
}

const clearError = state => ({ ...state, currentMessage: undefined })
const clearAll = state => ({
  ...state,
  currentMessage: undefined,
  logVisible: false,
  messages: [],
})

const handleShow = (state, { logVisible }) => ({
  ...state,
  logVisible,
})

export default createReducer(initialState, {
  [actionTypes.ERROR_OCCURRED]: handleError,
  [actionTypes.ERROR_CLEAR]: clearError,
  [actionTypes.ERROR_CLEAR_ALL]: clearAll,
  [actionTypes.ERROR_SHOW_LOG]: handleShow,
})
