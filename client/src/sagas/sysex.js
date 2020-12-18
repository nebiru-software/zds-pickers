import { sendMidiMessage } from 'redux-midi-fork'
import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { combineStatus } from 'zds-pickers'
import PromiseFileReader from 'promise-file-reader'
import Hash from 'object-hash'
import { getInputDeviceId, getOutputDeviceId } from 'selectors/midi'
import { ENTRY_SIZE_BYTES, GROUP_SIZE_BYTES, INPUT_CONTROL_SIZE_BYTES, MAX_GROUPS, MAX_INPUTS } from 'core/consts'
import {
  SYSEX_END,
  SYSEX_MSG_AVAILABILITY,
  SYSEX_MSG_BACKUP,
  SYSEX_MSG_CHANGE_GROUP_CHANNEL,
  SYSEX_MSG_CHANGE_GROUP_VALUE,
  SYSEX_MSG_FACTORY_RESET,
  SYSEX_MSG_GET_CONTROLS,
  SYSEX_MSG_GET_GROUPS,
  SYSEX_MSG_GET_STATE,
  SYSEX_MSG_GET_VERSION,
  SYSEX_MSG_RECEIVE_MODEL,
  SYSEX_MSG_RECEIVE_VERSION,
  SYSEX_MSG_REMOVE_ENTRY,
  SYSEX_MSG_RESTORE,
  SYSEX_MSG_SAVE_ENTRY_EDIT,
  SYSEX_MSG_SEND_CONTROLS,
  SYSEX_MSG_SEND_GROUPS,
  SYSEX_START,
  marshalMSB,
  parseMSB,
} from 'midi/sysex'
import { actions as versionActions } from 'reducers/version'
import { actions } from 'reducers/inputControls'
import { actions as shiftGroupActions } from 'reducers/shiftGroups'
import { actions as shifterActions } from 'reducers/shifter'
import actionTypes from 'reducers/actionTypes'
import { stateShifter, stateVersion } from 'selectors/index'
import { downloadFile, exportFile } from 'midi/export'
import { chunk } from 'fp/arrays'
import { promiseToEither } from 'fp/utils'
import { CURRENT_CLIENT_VERSION, SHIFTER_DEVICE_ID } from '../midi'

const reduceMidiMessage = ({ channel, status, value }) => [combineStatus(channel, status), value]

const reduceEntry = ({ input, output }) => [...reduceMidiMessage(input), ...reduceMidiMessage(output)]

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

function* handleSaveEntry({ groupId, editQueue }) {
  let { entryId } = editQueue
  if (entryId === -1) {
    entryId = 255
  }

  yield call(
    transmitAction,
    SYSEX_MSG_SAVE_ENTRY_EDIT,
    [groupId, entryId, ...reduceEntry(editQueue)],
  )
}

function* handleRemoveEntry({ groupId, entryId }) {
  if (Array.isArray(entryId)) {
    yield entryId.map(id => call(
      transmitAction,
      SYSEX_MSG_REMOVE_ENTRY,
      [groupId, id],
    ))
  } else {
    yield call(
      transmitAction,
      SYSEX_MSG_REMOVE_ENTRY,
      [groupId, entryId],
    )
  }
}

function* handleChangeGroupValue({ groupId, value }) {
  yield call(
    transmitAction,
    SYSEX_MSG_CHANGE_GROUP_VALUE,
    [groupId, value],
  )
}

function* handleChangeGroupChannel({ groupId, channel }) {
  yield call(
    transmitAction,
    SYSEX_MSG_CHANGE_GROUP_CHANNEL,
    [groupId, channel],
  )
}

function* handleFactoryReset({ restartToo }) {
  yield call(
    transmitAction,
    SYSEX_MSG_FACTORY_RESET,
    [restartToo],
  )
}

function* handleStartExport() {
  yield call(transmitAction, SYSEX_MSG_BACKUP)
}

function* handleReceivedBackupPacket() {
  const { firmware } = yield select(stateVersion)
  const { exportBuffer, exportFilename } = yield select(stateShifter)

  if (exportBuffer.length === 2034) {
    const output = yield exportFile(firmware, exportBuffer)
    yield call(downloadFile, output, exportFilename)
  }
}

function* invalidFile(callback) {
  yield put(shifterActions.settingsFileInvalid('Invalid settings file'))
  yield call(callback)
}

// Params are hash, version, then the rest
function* process([, , ...rest], callback) {
  const BLOCK_SIZE = 51
  try {
    const chunks = chunk(BLOCK_SIZE)(rest)
    let block
    for (let blockIdx = 0; blockIdx < chunks.length; blockIdx += 1) {
      block = chunks[blockIdx]
      yield delay(200)

      yield call(
        transmitAction,
        SYSEX_MSG_RESTORE,
        [blockIdx, BLOCK_SIZE, block.length, ...block],
      )
    }
    yield call(callback)
  } catch (e) {
    call(invalidFile, callback)
  }
}

function* handleImportSettings({ File, callback }) {
  const isValidFile = ([fileChecksum, ...rest]) => Hash(rest) === fileChecksum
  const either = yield promiseToEither(PromiseFileReader.readAsText(File, 'UTF-8'))

  if (either.isRight()) {
    const data = either.right()
      .trim()
      .split(' ')
      .map((value, idx) => (idx === 0 ? value : Number(value)))

    if (isValidFile(data)) {
      yield call(process, data, callback)
    } else {
      yield call(invalidFile, callback)
    }
  } else {
    yield call(invalidFile, callback)
  }
}

export default function* sysexSaga() {
  yield takeLatest(actionTypes.GET_SYSEX_CONTROLS, handleGetControls)
  yield takeLatest(actionTypes.GET_SYSEX_GROUPS, handleGetGroups)
  yield takeLatest(actionTypes.GET_SYSEX_VERSION, handleGetVersion)

  yield takeLatest(actionTypes.SAVE_ENTRY_EDIT, handleSaveEntry)
  yield takeLatest(actionTypes.REMOVE_ENTRY, handleRemoveEntry)

  yield takeLatest(actionTypes.CHANGE_GROUP_VALUE, handleChangeGroupValue)
  yield takeLatest(actionTypes.CHANGE_GROUP_CHANNEL, handleChangeGroupChannel)

  yield takeLatest(actionTypes.FACTORY_RESET, handleFactoryReset)

  yield takeLatest(actionTypes.EXPORT_SETTINGS, handleStartExport)
  yield takeLatest(actionTypes.EXPORT_SETTINGS_PACKET, handleReceivedBackupPacket)

  yield takeLatest(actionTypes.IMPORT_SETTINGS, handleImportSettings)

  yield takeLatest('redux-midi/midi/RECEIVE_MIDI_MESSAGE', handleReceiveMessage)
  // yield fork(deviceCheckFlow)
}
