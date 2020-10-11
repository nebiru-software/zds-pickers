import { actions as versionActions } from '../reducers/version'
import { actions } from '../reducers/inputControls'
import { actions as shiftGroupActions } from '../reducers/shiftGroups'
import { actions as shifterActions } from '../reducers/shifter'
import {
  SYSEX_MSG_AVAILABILITY,
  SYSEX_MSG_BACKUP,
  SYSEX_MSG_GET_STATE,
  SYSEX_MSG_RECEIVE_MODEL,
  SYSEX_MSG_RECEIVE_VERSION,
  SYSEX_MSG_SEND_CONTROLS,
  SYSEX_MSG_SEND_GROUPS,
  SYSEX_START,
  parseMSB,
} from './sysex'
import { shifterInputId } from './devices'
import { SHIFTER_DEVICE_ID } from '.'

const controlsPresent = packet => packet.length > 0
const controlsValid = packet => packet.length % 5 === 0

const groupsPresent = packet => packet.length >= 12
const groupsValid = packet => (packet.length - 12) % 4 === 0

const processMidiMessage = (dispatch, { data, device }) => {
  const [
    kind,
    deviceId,
    firmwareVersion, // eslint-disable-line
    command,
    ...packet
  ] = parseMSB(data)
  console.log(
    kind,
    deviceId,
    firmwareVersion, command, packet,
  )

  // One of our packets?  (and only over usb)
  if (kind === SYSEX_START && deviceId === SHIFTER_DEVICE_ID && (device === shifterInputId())) {
    let serial

    switch (command) {
      case SYSEX_MSG_RECEIVE_VERSION:
        // TODO: find more functional way to do this.
        // Trim SysEx header and footer
        serial = [...packet].slice(1, packet.length - 2)
        // Remove any trailing zeros (but none within!)
        while (serial.length && serial[serial.length - 1] === 0) {
          serial.pop()
        }

        dispatch(versionActions.receivedVersion(
          packet[0], // version
          serial.reduce((val, char) => val + String.fromCharCode(char), ''),
        ))

        dispatch(actions.askForControls())
        dispatch(shiftGroupActions.askForGroups())
        break

      case SYSEX_MSG_RECEIVE_MODEL:
        dispatch(versionActions.receivedModel(packet[0] === 1))
        break

      case SYSEX_MSG_SEND_CONTROLS:
        /* istanbul ignore if */
        if (controlsPresent(packet) && controlsValid(packet)) {
          dispatch(actions.receivedControls(packet))
        } else {
          throw new Error('Invalid or missing control data received')
        }
        break

      case SYSEX_MSG_SEND_GROUPS:
        /* istanbul ignore if */

        if (groupsPresent(packet) && groupsValid(packet)) {
          dispatch(shiftGroupActions.receivedGroups(packet))
        } else {
          throw new Error('Invalid or missing group data received')
        }
        break

      case SYSEX_MSG_GET_STATE:
        dispatch(actions.receivedInternalState(packet))
        break

      case SYSEX_MSG_AVAILABILITY:
        dispatch(shifterActions.receivedAvailability(packet[0] === 1))
        break

      case SYSEX_MSG_BACKUP:
        dispatch(shifterActions.receivedExportPacket(packet))
        break

      default:
        throw new Error('Unknown SysEx message received: ', command)
    }
  }
}

export default processMidiMessage
