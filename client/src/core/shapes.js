import { arrayOf, bool, func, number, oneOf, shape, string } from 'prop-types'
import {
  ACTIVITY_LED_MODE_ALWAYS_OFF,
  ACTIVITY_LED_MODE_ALWAYS_ON,
  ACTIVITY_LED_MODE_NORMALLY_OFF,
  ACTIVITY_LED_MODE_NORMALLY_ON,
} from '../midi/sysex'
import {
  SORT_ASC,
  SORT_BY_ALL,
  SORT_BY_CHANNEL,
  SORT_BY_MESSAGE,
  SORT_BY_VALUE,
  SORT_DESC,
  SORT_ON_INPUT,
  SORT_ON_OUTPUT,
} from './consts'

export const midiMessageShape = shape({
  channel: number.isRequired,
  status: number.isRequired,
  value: number.isRequired,
})

export const entryShape = shape({
  entryId: number.isRequired,
  input: midiMessageShape.isRequired,
  output: midiMessageShape.isRequired,
})

export const groupShape = shape({
  groupId: number.isRequired,
  label: string.isRequired,
  value: number.isRequired,
  channel: number.isRequired,
  entries: arrayOf(entryShape).isRequired,
  active: bool.isRequired,
  editing: bool.isRequired,
  editQueue: entryShape,
  selectedEntryId: number.isRequired,
  selectedRows: arrayOf(number).isRequired,
  sortOn: oneOf([SORT_ON_INPUT, SORT_ON_OUTPUT]).isRequired,
  sortBy: oneOf([SORT_BY_ALL, SORT_BY_CHANNEL, SORT_BY_MESSAGE, SORT_BY_VALUE]).isRequired,
})

export const groupsShape = shape({
  selectedGroupIdx: number.isRequired,
  maxEntries: number.isRequired,
  totalEntries: number.isRequired,
  groups: arrayOf(groupShape).isRequired,
})

export const inputControlShape = shape({
  controlId: number.isRequired,
  channel: number.isRequired,
  calibrationLow: number.isRequired,
  calibrationHigh: number.isRequired,
  curve: number.isRequired,
  polarity: number.isRequired,
  latching: number.isRequired,
  status: number,
  value: number.isRequired,
  active: bool.isRequired,
  lit: bool.isRequired,
})

export const inputEventsShape = shape({
  handleChangeValue: func.isRequired,
  handleChangeChannel: func.isRequired,
  handleChangeLatching: func.isRequired,
  handleChangePolarity: func.isRequired,
})

export const mappingGroupShape = shape({
  value: string.isRequired,
  label: string.isRequired,
})

export const mappingNoteShape = shape({
  group: string.isRequired,
  name: string.isRequired,
  note: number.isRequired,
})

export const mappingsShape = shape({
  dialogVisible: bool.isRequired,
  userDialogVisible: bool.isRequired,
  userImportDialogVisible: bool.isRequired,
  channels: arrayOf(string).isRequired,
  stockMappings: arrayOf(string).isRequired,
  userMappings: arrayOf(string).isRequired,
})

export const shifterShape = shape({
  errorMessage: string.isRequired,
  errorVisible: bool.isRequired,
  responding: bool.isRequired,
  searchedForShifter: bool.isRequired,
  accessGranted: bool.isRequired,
  found: bool.isRequired,
  testInterfaceFound: bool.isRequired,
  hardwareTestVisible: bool.isRequired,
  ready: bool.isRequired,
  midiInActivity: bool.isRequired,
  midiOutActivity: bool.isRequired,
  showResetDialog: bool.isRequired,
  resetInProcess: bool.isRequired,
  exportFilename: string.isRequired,
  importInProcess: bool.isRequired,
  invalidSettingsFile: string,
  midiActivityLEDMode: oneOf([
    ACTIVITY_LED_MODE_NORMALLY_ON,
    ACTIVITY_LED_MODE_NORMALLY_OFF,
    ACTIVITY_LED_MODE_ALWAYS_ON,
    ACTIVITY_LED_MODE_ALWAYS_OFF,
  ]).isRequired,
  serialMidiOutEnabled: bool.isRequired,
  usbMidiOutEnabled: bool.isRequired,
  exportBuffer: arrayOf(number).isRequired,
})

export const sortShape = {
  sortOn: oneOf([SORT_ON_INPUT, SORT_ON_OUTPUT]).isRequired,
  sortBy: oneOf([SORT_BY_ALL, SORT_BY_CHANNEL, SORT_BY_MESSAGE, SORT_BY_VALUE]).isRequired,
  sortDir: oneOf([SORT_ASC, SORT_DESC]).isRequired,
}

export const userShape = shape({
  serialNumber: string.isRequired,
  firstName: string.isRequired,
  lastName: string.isRequired,
  email: string.isRequired,
  checkedRegistration: bool.isRequired,
  registered: bool.isRequired,
  dialogVisible: bool.isRequired,
})

export const versionShape = shape({
  checking: bool.isRequired,
  checked: bool.isRequired,
  client: number.isRequired,
  firmware: number.isRequired,
})

export const hardwareTestShape = shape({
  step: number.isRequired,
  done: bool.isRequired,
  busy: bool.isRequired,
  performingReset: bool.isRequired,
  creatingRules: bool.isRequired,
  sendingEntries: bool.isRequired,
  sendingMessages: bool.isRequired,
  messagesReceived: arrayOf(midiMessageShape).isRequired,
  passed: bool.isRequired,
})
