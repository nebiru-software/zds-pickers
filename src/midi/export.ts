const STATUS_NOTE_OFF = 8 // 1000
const STATUS_NOTE_ON = 9 // 1001
const STATUS_AFTER_TOUCH = 10 // 1010
const STATUS_CONTROL_CHANGE = 11 // 1011
const STATUS_PROGRAM_CHANGE = 12 // 1100
const STATUS_CHANNEL_PRESSURE = 13 // 1101
const STATUS_PITCH_WHEEL = 14 // 1110

type Status =
  | typeof STATUS_NOTE_OFF
  | typeof STATUS_NOTE_ON
  | typeof STATUS_AFTER_TOUCH
  | typeof STATUS_CONTROL_CHANGE
  | typeof STATUS_PROGRAM_CHANGE
  | typeof STATUS_CHANNEL_PRESSURE
  | typeof STATUS_PITCH_WHEEL

const Statuses: Record<string, Status> = {
  noteOff: STATUS_NOTE_OFF,
  noteOn: STATUS_NOTE_ON,
  aftertouch: STATUS_AFTER_TOUCH,
  controlChange: STATUS_CONTROL_CHANGE,
  programChange: STATUS_PROGRAM_CHANGE,
  channelPressure: STATUS_CHANNEL_PRESSURE,
  pitchWheel: STATUS_PITCH_WHEEL,
}

const MASK_CHANNEL = 15 // 00001111
const MASK_STATUS = 240 // 01110000

const statuses: { value: Status; label: string }[] = [
  { value: STATUS_NOTE_ON, label: 'Note On' },
  { value: STATUS_NOTE_OFF, label: 'Note Stack' },
  { value: STATUS_CONTROL_CHANGE, label: 'Control Change' },
  { value: STATUS_PROGRAM_CHANGE, label: 'Program Change' },
  { value: STATUS_AFTER_TOUCH, label: 'Aftertouch' },
  { value: STATUS_CHANNEL_PRESSURE, label: 'Channel Pressure' },
  { value: STATUS_PITCH_WHEEL, label: 'Pitch Wheel' },
]

const getStatusLabel = (val: Status) =>
  statuses.filter(({ value }) => value === val)[0]?.label || '???'

const combineStatus = (channel: number, status: number) =>
  channel | (status << 4)

const extractStatus = (status: number) => ({
  status: ((status & MASK_STATUS) >> 4) | 8,
  channel: status & MASK_CHANNEL,
})

export { combineStatus, extractStatus, getStatusLabel, statuses, Statuses }
