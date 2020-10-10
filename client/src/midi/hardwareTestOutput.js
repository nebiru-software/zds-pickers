/* eslint-disable import/prefer-default-export */
import { sendMidiMessage } from 'redux-midi-fork'
import { testInterfaceOutputId } from './devices'

const transmitAction = (message, data) => sendMidiMessage({
  data: [message, ...data],
  timestamp: 0, // performance.now(),
  device: testInterfaceOutputId(),
})

export const sendMessage = (dispatch, message, data) => {
  dispatch(transmitAction(message, data))
}
