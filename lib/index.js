// Pickers
export { default as CCPicker } from './pickers/CCPicker'
export { default as ChannelPicker } from './pickers/ChannelPicker'
export { default as LatchPicker } from './pickers/LatchPicker'
export { default as NotePicker } from './pickers/NotePicker'
export { default as PolarityPicker } from './pickers/PolarityPicker'
export { default as StatusPicker } from './pickers/StatusPicker'
export { default as ValuePicker } from './pickers/ValuePicker'

// MIDI
export {
  default as statuses,
  getStatusLabel,
  combineStatus,
  extractStatus,
  STATUS_NOTE_OFF,
  STATUS_NOTE_ON,
  STATUS_AFTER_TOUCH,
  STATUS_CONTROL_CHANGE,
  STATUS_PROGRAM_CHANGE,
  STATUS_CHANNEL_PRESSURE,
  STATUS_PITCH_WHEEL,
  MASK_CHANNEL,
  MASK_STATUS,
} from './midi/statuses'

export { default as ccValues } from './midi/ccValues'

export const assertRange = (value, max = 127, min = 0) => {
  let result = parseInt(value, 10)
  if (Number.isNaN(value)) {
    result = min
  }

  return result >= min ? (result <= max ? result : max) : min
}
