import { sendMidiMessage } from 'redux-midi-fork'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { CURRENT_CLIENT_VERSION, SHIFTER_DEVICE_ID } from '../midi'
import {
  SYSEX_END,
  SYSEX_MSG_AVAILABILITY,
  SYSEX_MSG_BACKUP,
  SYSEX_MSG_GET_CONTROLS,
  SYSEX_MSG_GET_GROUPS,
  SYSEX_MSG_GET_STATE,
  SYSEX_MSG_GET_VERSION,
  SYSEX_MSG_RECEIVE_MODEL,
  SYSEX_MSG_RECEIVE_VERSION,
  SYSEX_MSG_SEND_CONTROLS,
  SYSEX_MSG_SEND_GROUPS,
  SYSEX_START,
  marshalMSB,
  parseMSB,
} from '../midi/sysex'
import { actions as versionActions } from '../reducers/version'
import { actions } from '../reducers/inputControls'
import { actions as shiftGroupActions } from '../reducers/shiftGroups'
import { actions as shifterActions } from '../reducers/shifter'
import actionTypes from '../reducers/actionTypes'
import { getInputDeviceId, getOutputDeviceId } from '../selectors/midi'
import { actions as userActions } from '../reducers/user'
import { ENTRY_SIZE_BYTES, GROUP_SIZE_BYTES, INPUT_CONTROL_SIZE_BYTES, MAX_GROUPS, MAX_INPUTS } from '../core/consts'

const controlsPresent = packet => packet.length >= INPUT_CONTROL_SIZE_BYTES * MAX_INPUTS
const controlsValid = packet => packet.length % INPUT_CONTROL_SIZE_BYTES === 0

const groupsPresent = packet => packet.length >= MAX_GROUPS * GROUP_SIZE_BYTES
const groupsValid = packet => (packet.length - (MAX_GROUPS * GROUP_SIZE_BYTES)) % ENTRY_SIZE_BYTES === 0

function* transmitAction(command, data = []) {
  const { id } = yield select(getOutputDeviceId)
  // console.log(marshalMSB([command, ...data]))

  yield put(sendMidiMessage({
    data: [
      SYSEX_START,
      SHIFTER_DEVICE_ID,
      CURRENT_CLIENT_VERSION,
      ...marshalMSB([command, ...data]),
      SYSEX_END,
    ],
    timestamp: 0, // performance.now(),
    device: id,
  }))
}

function* handleReceiveMessage({ payload: { device, data } }) {
  const { id: shifterInputId } = yield select(getInputDeviceId)
  // console.log(device, data)
  const [
    kind,
    deviceId,
    firmwareVersion, // eslint-disable-line
    command,
    ...packet
  ] = parseMSB(data)

  // One of our packets?  (and only over usb)
  if (kind === SYSEX_START && deviceId === SHIFTER_DEVICE_ID && device === shifterInputId) {
    let firmware
    let serial
    let serialNumber

    switch (command) {
      case SYSEX_MSG_RECEIVE_VERSION:
        // TODO: find more functional way to do this.
        // Trim SysEx header and footer
        serial = [...packet].slice(1, packet.length - 2)
        // Remove any trailing zeros (but none within!)
        while (serial.length && serial[serial.length - 1] === 0) {
          serial.pop()
        }

        // eslint-disable-next-line prefer-destructuring
        firmware = packet[0]
        serialNumber = serial.reduce((val, char) => val + String.fromCharCode(char), '')

        yield put(versionActions.receivedVersion(firmware, serialNumber))
        // yield put(userActions.checkRegistration(serialNumber, firmware))

        yield put(actions.askForControls())
        yield put(shiftGroupActions.askForGroups())
        break

      case SYSEX_MSG_RECEIVE_MODEL:
        yield put(versionActions.receivedModel(packet[0] === 1))
        break

      case SYSEX_MSG_SEND_CONTROLS:
        /* istanbul ignore if */
        if (controlsPresent(packet) && controlsValid(packet)) {
          yield put(actions.receivedControls(packet))
        } else {
          throw new Error('Invalid or missing control data received')
        }
        break

      case SYSEX_MSG_SEND_GROUPS:
        /* istanbul ignore if */
        if (groupsPresent(packet) && groupsValid(packet)) {
          yield put(shiftGroupActions.receivedGroups(packet))
        } else {
          throw new Error('Invalid or missing group data received')
        }
        break

      case SYSEX_MSG_GET_STATE:
        yield put(actions.receivedInternalState(packet))
        break

      case SYSEX_MSG_AVAILABILITY:
        yield put(shifterActions.receivedAvailability(packet[0] === 1))
        break

      case SYSEX_MSG_BACKUP:
        yield put(shifterActions.receivedExportPacket(packet))
        break

      default:
        throw new Error('Unknown SysEx message received: ', command)
    }
  }
}

function* handleGetControls() {
  yield call(transmitAction, SYSEX_MSG_GET_CONTROLS)
}

function* handleGetGroups() {
  yield call(transmitAction, SYSEX_MSG_GET_GROUPS)
}

function* handleGetVersion(action) {
  yield call(
    transmitAction,
    SYSEX_MSG_GET_VERSION,
    Array.from(action.serialNumber, char => char.charCodeAt(0)),
  )
}

export default function* sysexSaga() {
  yield takeLatest(actionTypes.GET_SYSEX_CONTROLS, handleGetControls)
  yield takeLatest(actionTypes.GET_SYSEX_GROUPS, handleGetGroups)
  yield takeLatest(actionTypes.GET_SYSEX_VERSION, handleGetVersion)

  yield takeLatest('redux-midi/midi/RECEIVE_MIDI_MESSAGE', handleReceiveMessage)
  // yield fork(deviceCheckFlow)
}
