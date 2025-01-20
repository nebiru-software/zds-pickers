import type { Option } from 'lib/pickers/Select'

const Statuses = {
  noteOff: 8, // 1000
  noteOn: 9, // 1001
  aftertouch: 10, // 1010
  controlChange: 11, // 1011
  programChange: 12, // 1100
  channelPressure: 13, // 1101
  pitchWheel: 14, // 1110
}

type Status = (typeof Statuses)[keyof typeof Statuses]

const MASK_CHANNEL = 15 // 00001111
const MASK_STATUS = 240 // 01110000

const statusOptions: Option<Status>[] = [
  { value: Statuses.noteOn, label: 'Note On' },
  { value: Statuses.noteOff, label: 'Note Stack' },
  { value: Statuses.controlChange, label: 'Control Change' },
  { value: Statuses.programChange, label: 'Program Change' },
  { value: Statuses.aftertouch, label: 'Aftertouch' },
  { value: Statuses.channelPressure, label: 'Channel Pressure' },
  { value: Statuses.pitchWheel, label: 'Pitch Wheel' },
]

const getStatusLabel = (val: Status) =>
  statusOptions.filter(({ value }) => value === val)[0]?.label || '???'

const combineStatusWithChannel = (channel: number, status: Status) =>
  channel | (status << 4)

const extractStatusAndChannel = (
  status: number,
): {
  status: Status
  channel: number
} => ({
  status: (((status & MASK_STATUS) >> 4) | 8) as Status,
  channel: status & MASK_CHANNEL,
})

export {
  combineStatusWithChannel,
  extractStatusAndChannel,
  getStatusLabel,
  MASK_CHANNEL,
  MASK_STATUS,
  statusOptions,
  Statuses,
}

export type { Status }
