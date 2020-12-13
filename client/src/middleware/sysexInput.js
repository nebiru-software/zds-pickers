import { RECEIVE_MIDI_MESSAGE, SEND_MIDI_MESSAGE } from 'redux-midi-fork'
import { debounce } from '../core/fp/utils'
import actionTypes from '../reducers/actionTypes'
import { actions as shifterActions } from '../reducers/shifter'
import { actions as versionActions } from '../reducers/version'
import processMidiMessage from '../midi/sysexInput'

let midiInTimer
let midiOutTimer
let waitForVersionTimer

let debouncedIdle = null

export default ({ dispatch }) => next => (action) => {
  const flickerTimeout = 200
  const assumeNotRespondingTimeout = 1000
  const { payload, type } = action

  if (!debouncedIdle) {
    debouncedIdle = debounce(1000, () => dispatch({ type: actionTypes.MIDI_IDLE }))
  }

  switch (type) {
  case RECEIVE_MIDI_MESSAGE:
    debouncedIdle()
    processMidiMessage(dispatch, payload)
    clearTimeout(midiInTimer)
    dispatch(shifterActions.midiInActivityChanged(true))
    /* istanbul ignore next */
    midiInTimer = setTimeout(() => {
      dispatch(shifterActions.midiInActivityChanged(false))
    }, flickerTimeout)
    break

  case SEND_MIDI_MESSAGE:
    clearTimeout(midiOutTimer)
    dispatch(shifterActions.midiOutActivityChanged(true))
    /* istanbul ignore next */
    midiOutTimer = setTimeout(() => {
      dispatch(shifterActions.midiOutActivityChanged(false))
    }, flickerTimeout)
    break

  case actionTypes.SHIFTER_FOUND:
    // istanbul ignore next
    waitForVersionTimer = setTimeout(() => {
      // TODO: why is this firing?
      dispatch(shifterActions.notResponding())
    }, assumeNotRespondingTimeout)
    dispatch(versionActions.checkVersion())
    dispatch(versionActions.checkModel())
    break

    // istanbul ignore next
  case actionTypes.RECEIVED_VERSION:
    clearTimeout(waitForVersionTimer)
    break

  default:
    break
  }
  return next(action)
}
