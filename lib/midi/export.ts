import type { Option, noSelection } from 'lib/pickers/Select'

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

const ResponseCurveLabels = {
  [RESPONSE_CURVE_0]: 'Linear, no change',
  [RESPONSE_CURVE_1]: 'A little less sensitive',
  [RESPONSE_CURVE_2]: 'Even less sensitive',
  [RESPONSE_CURVE_3]: 'Least sensitive',
  [RESPONSE_CURVE_4]: 'A little sensitive',
  [RESPONSE_CURVE_5]: 'Moderately sensitive',
  [RESPONSE_CURVE_6]: 'Most sensitive',
  [RESPONSE_CURVE_7]: 'Always maxed out',
} as const

// type Curve = (typeof Items)[keyof typeof Items]

type Curve = keyof typeof ResponseCurveLabels | typeof noSelection

const responseCurves: Option<Curve>[] = Object.keys(ResponseCurveLabels)
  .map(Number)
  .map(key => ({
    value: key as Curve,
    label: ResponseCurveLabels[key as keyof typeof ResponseCurveLabels],
  }))

export {
  combineStatusWithChannel,
  extractStatusAndChannel,
  getStatusLabel,
  MASK_CHANNEL,
  MASK_STATUS,
  responseCurves,
  ResponseCurveLabels,
  Statuses,
  statusOptions,
}

export type { Curve, Status }
