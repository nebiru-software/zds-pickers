/* eslint-disable no-plusplus, no-bitwise, no-continue */
export const SYSEX_START = 0xf0
export const SYSEX_END = 0xf7

export const SYSEX_MSG_GET_VERSION = 0x01
export const SYSEX_MSG_RECEIVE_VERSION = 0x02
export const SYSEX_MSG_GET_CONTROLS = 0x03
export const SYSEX_MSG_SEND_CONTROLS = 0x04
export const SYSEX_MSG_GET_GROUPS = 0x05
export const SYSEX_MSG_SEND_GROUPS = 0x06
export const SYSEX_MSG_GET_MODEL = 0x07
export const SYSEX_MSG_RECEIVE_MODEL = 0x08
export const SYSEX_MSG_GET_STATE = 0x09
export const SYSEX_MSG_RECEIVE_FLAGS = 0x0a

export const SYSEX_MSG_CHANGE_GROUP_CHANNEL = 0x0b
export const SYSEX_MSG_CHANGE_GROUP_VALUE = 0x0c
export const SYSEX_MSG_SAVE_ENTRY_EDIT = 0x0d
export const SYSEX_MSG_REMOVE_ENTRY = 0x0e

export const SYSEX_MSG_AVAILABILITY = 0x0f

export const SYSEX_MSG_BACKUP = 0x10
export const SYSEX_MSG_RESTORE = 0x11

export const SYSEX_MSG_RESTART = 0x7d
export const SYSEX_MSG_FACTORY_RESET = 0x7e

export const ACTIVITY_LED_MODE_NORMALLY_ON = 0
export const ACTIVITY_LED_MODE_NORMALLY_OFF = 1
export const ACTIVITY_LED_MODE_ALWAYS_ON = 2
export const ACTIVITY_LED_MODE_ALWAYS_OFF = 3

export const marshalMSB = (data = []) => {
  const result = []
  let i
  let j
  let c

  switch (data.length) {
  case 0:
    break
  case 1:
    result.push(0, data[0])
    break
  default:
    for (i = 0; i < data.length - 1;) {
      for (j = 0, c = 0; j < 7 && i < data.length; ++j) {
        // collect d7 bits from next seven bytes
        if (data[i++] & 0x80) {
          // if d7 set
          c |= 1 << j // collect it
        }
      }

      result.push(c) // send d7 byte
      while (j) {
        // send the seven bytes (or whatever was left at the end)
        result.push(data[i - j--] & ~0x80) // with d7 clear
      }
    }
    break
  }

  return result
}

export const parseMSB = ([BYTE_START, DEVICE, VERSION, ...data]) => {
  const packet = []
  let highBits
  let i
  let rank
  for (i = 0; i < data.length - 1; i++) {
    rank = i % 8 // We split the data in runs of 8 bytes
    if (rank === 0) {
      // Start of the run Get the high bits
      highBits = data[i]
    } else {
      packet.push(data[i] | (highBits & (1 << (rank - 1)) ? 0x80 : 0))
    }
  }

  return [BYTE_START, DEVICE, VERSION, ...packet]
}
