import actionTypes from '../reducers/actionTypes'
import { sendMessage } from '../midi/hardwareTestOutput'

export default store => next => (action) => {
  // Allow the reducers to process the command first
  const result = next(action)

  const { dispatch /* , getState */ } = store

  if (action.type === actionTypes.HARDWARE_TEST_SEND_MESSAGE) {
    sendMessage(dispatch, action.message, action.data)
  }

  // No matter what, return the updated store state
  return result
}
