export const STATUS_NOTE_OFF = 8 // 1000
export const STATUS_NOTE_ON = 9 // 1001
export const STATUS_AFTER_TOUCH = 10 // 1010
export const STATUS_CONTROL_CHANGE = 11 // 1011
export const STATUS_PROGRAM_CHANGE = 12 // 1100
export const STATUS_CHANNEL_PRESSURE = 13 // 1101
export const STATUS_PITCH_WHEEL = 14 // 1110

export const MASK_CHANNEL = 15 // 00001111
export const MASK_STATUS = 112 // 01110000

const statuses = [
  { value: STATUS_NOTE_ON, label: 'Note On' },
  { value: STATUS_NOTE_OFF, label: 'Note Stack' },
  { value: STATUS_CONTROL_CHANGE, label: 'Control Change' },
  { value: STATUS_PROGRAM_CHANGE, label: 'Program Change' },
  { value: STATUS_AFTER_TOUCH, label: 'Aftertouch' },
  { value: STATUS_CHANNEL_PRESSURE, label: 'Channel Pressure' },
  { value: STATUS_PITCH_WHEEL, label: 'Pitch Wheel' },
]

export const getStatusLabel = val =>
  statuses.filter(({ value }) => value === val)[0].label //

export const combineStatus = (channel, status) => channel | (status << 4)

export const extractStatus = status => ({
  status: ((status & MASK_STATUS) >> 4) | 8,
  channel: status & MASK_CHANNEL,
})

export default statuses
