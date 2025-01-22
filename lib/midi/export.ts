import type { Option } from 'lib/pickers/Select'

const Statuses = {
  noteOff: 8, // 1000
  noteOn: 9, // 1001
  aftertouch: 10, // 1010
  controlChange: 11, // 1011
  programChange: 12, // 1100
  channelPressure: 13, // 1101
  pitchWheel: 14, // 1110
} as const

// Define type as union of literal values
type Status = 8 | 9 | 10 | 11 | 12 | 13 | 14

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

const RESPONSE_CURVE_0 = 0
const RESPONSE_CURVE_1 = 1
const RESPONSE_CURVE_2 = 2
const RESPONSE_CURVE_3 = 3
const RESPONSE_CURVE_4 = 4
const RESPONSE_CURVE_5 = 5
const RESPONSE_CURVE_6 = 6
const RESPONSE_CURVE_7 = 7

type Curve =
  | typeof RESPONSE_CURVE_0
  | typeof RESPONSE_CURVE_1
  | typeof RESPONSE_CURVE_2
  | typeof RESPONSE_CURVE_3
  | typeof RESPONSE_CURVE_4
  | typeof RESPONSE_CURVE_5
  | typeof RESPONSE_CURVE_6
  | typeof RESPONSE_CURVE_7

const responseCurves: Option<Curve>[] = [
  {
    value: RESPONSE_CURVE_7,
    label: 'Always maxed out.',
  },
  {
    value: RESPONSE_CURVE_6,
    label: 'Most sensitive.',
  },
  {
    value: RESPONSE_CURVE_5,
    label: 'Moderately sensitive.',
  },
  {
    value: RESPONSE_CURVE_4,
    label: 'A little sensitive.',
  },
  {
    value: RESPONSE_CURVE_0,
    label: 'Linear, no change.',
  },
  {
    value: RESPONSE_CURVE_1,
    label: 'A little less sensitive.',
  },
  {
    value: RESPONSE_CURVE_2,
    label: 'Even less sensitive.',
  },
  {
    value: RESPONSE_CURVE_3,
    label: 'Least sensitive.',
  },
]

export {
  combineStatusWithChannel,
  extractStatusAndChannel,
  getStatusLabel,
  MASK_CHANNEL,
  MASK_STATUS,
  responseCurves,
  Statuses,
  statusOptions,
}

export type { Curve, Status }
