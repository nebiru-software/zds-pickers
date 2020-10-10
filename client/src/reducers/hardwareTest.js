/* eslint-disable no-bitwise, no-console */
import {
  MASK_CHANNEL,
  MASK_STATUS,
  STATUS_CONTROL_CHANGE,
  STATUS_NOTE_OFF,
  STATUS_NOTE_ON,
  combineStatus,
} from 'zds-pickers/dist/midi/statuses'
import rules from '../components/device/hardwareTest/rules'
import echoMessages from '../components/device/hardwareTest/echoMessages'
import { shifterInputId, testInterfaceInputId } from '../midi/devices'
import { SHIFTER_CC_MESSAGE } from '../midi'
import { delay } from '../core/fp/utils'
import { isEqual } from '../core/fp/objects'
import { createReducer } from './utils'
import { actions as shifterActions } from './shifter'
import actionTypes from './actionTypes'
import { compareAll, compareValue } from './shiftEntry'

const initialState = {
  step: 0,
  done: false,
  busy: false,
  performingReset: false,
  creatingRules: false,
  sendingEntries: false,
  sendingMessages: false,
  messagesReceived: [],
  passed: true,
}

export const actions = {
  nextStep: () => ({ type: actionTypes.HARDWARE_TEST_NEXT }),

  performFactoryReset: done => (dispatch) => {
    dispatch({ type: actionTypes.HARDWARE_TEST_FACTORY_RESET, done })
    dispatch(shifterActions.performFactoryReset(true))
  },

  sendEntries: busy => (dispatch) => {
    dispatch({ type: actionTypes.HARDWARE_TEST_SEND_ENTRIES, busy })

    rules.forEach(({ groupId, ...rest }) => {
      dispatch({ type: actionTypes.SAVE_ENTRY_EDIT, groupId, editQueue: { ...rest } })
      delay(50)
    })

    // Turn on both buttons
    dispatch({
      type: actionTypes.HARDWARE_TEST_SEND_MESSAGE,
      message: combineStatus(9, STATUS_CONTROL_CHANGE),
      data: [SHIFTER_CC_MESSAGE, 127],
    })

    delay(50)

    dispatch({
      type: actionTypes.HARDWARE_TEST_SEND_MESSAGE,
      message: combineStatus(9, STATUS_CONTROL_CHANGE),
      data: [SHIFTER_CC_MESSAGE + 1, 127],
    })
  },

  sendMessages: () => (dispatch) => {
    dispatch({ type: actionTypes.HARDWARE_TEST_SEND_MESSAGES })
    rules.forEach(({ input: { channel, status, value } }) => {
      dispatch({
        type: actionTypes.HARDWARE_TEST_SEND_MESSAGE,
        message: combineStatus(channel, status),
        data: [value, 127],
      })
      delay(50)
    })

    echoMessages.forEach(({ channel, status, value }) => {
      dispatch({
        type: actionTypes.HARDWARE_TEST_SEND_MESSAGE,
        message: combineStatus(channel, status),
        data: [value, 102],
      })
      delay(50)
    })
  },
}

const analyzeResults = (messagesReceived) => {
  const messagesByDevice = deviceId => messagesReceived //
    .filter(({ device }) => device === deviceId)
    .map(({ device, value, ...rest }) => ({ ...rest }))
    .map(({ noteNum: value, ...rest }) => ({ value, ...rest }))
  const dinMessages = messagesByDevice(testInterfaceInputId())
  const usbMessages = messagesByDevice(shifterInputId())

  console.log('din received', dinMessages)
  console.log('usb received', usbMessages)

  if (dinMessages.length + usbMessages.length !== (rules.length + echoMessages.length) * 2 + 2) {
    console.error('Not enough messages were received!')
    console.log(dinMessages.length + usbMessages.length, (rules.length + echoMessages.length) * 2 + 2)

    return false
  }

  if (!isEqual(dinMessages, usbMessages)) {
    console.error('DIN and USB results are not the same')
    return false
  }

  const expected = [
    //
    ...rules.map(({ output }) => ({ ...output })),
    ...echoMessages,
    ...rules //
      .filter(({ output: { status } }) => status === STATUS_NOTE_OFF)
      .map(({ input }) => ({ ...input })),
  ]
    .map(({ value, channel, status }) => ({
      value,
      channel,
      status: status === STATUS_NOTE_OFF ? STATUS_NOTE_ON : status,
    }))
    .sort(compareAll)
    .sort(compareValue)

  const actual = dinMessages.sort(compareAll).sort(compareValue)

  if (!isEqual(expected, actual)) {
    console.error('Outputs did not match expectations:')
    console.log('expected - actual')
    console.log(expected, actual)
    return false
  }

  return true
}

const reset = () => ({ ...initialState })

const changeStep = inc => state => ({ ...state, step: state.step + inc })

const handleFactoryReset = (state, { done }) => ({
  ...state,
  busy: true,
  performingReset: true,
  done,
})

const handleSendEntries = (state, { busy }) => ({ ...state, busy, creatingRules: true })

const handleIdle = (state) => {
  const newState = {
    ...state,
    busy: false,
    creatingRules: false,
    performingReset: false,
    sendingMessages: false,
  }

  if (state.sendingMessages) {
    newState.passed = analyzeResults(state.messagesReceived)
  }

  return newState
}

const handleSendMessages = state => ({ ...state, busy: true, sendingMessages: true })

const receivedMidiMessage = (state, { payload }) => {
  if (state.sendingMessages) {
    const { data, device } = payload
    const [message, noteNum, value] = data
    const channel = message & MASK_CHANNEL
    const status = ((message & MASK_STATUS) >> 4) | 8
    return {
      ...state,
      messagesReceived: [
        ...state.messagesReceived,
        {
          device,
          channel,
          status,
          noteNum,
          value,
        },
      ],
    }
  }
  return state
}

export default createReducer(initialState, {
  [actionTypes.SHOW_HARDWARE_TEST_DIALOG]: reset,
  [actionTypes.HARDWARE_TEST_NEXT]: changeStep(1),
  [actionTypes.HARDWARE_TEST_FACTORY_RESET]: handleFactoryReset,
  [actionTypes.HARDWARE_TEST_SEND_ENTRIES]: handleSendEntries,
  [actionTypes.MIDI_IDLE]: handleIdle,
  [actionTypes.HARDWARE_TEST_SEND_MESSAGES]: handleSendMessages,
  'redux-midi/midi/RECEIVE_MIDI_MESSAGE': receivedMidiMessage,
})
