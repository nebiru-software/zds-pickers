import {
  STATUS_CONTROL_CHANGE,
  // STATUS_CHANNEL_PRESSURE,
  STATUS_NOTE_OFF,
  STATUS_NOTE_ON,
} from 'zds-pickers/dist/midi/statuses'

export default [
  // GROUP A
  {
    groupId: 0,
    entryId: -1,
    input: {
      channel: 9,
      status: STATUS_NOTE_ON,
      value: 1,
    },
    output: {
      channel: 9,
      status: STATUS_NOTE_ON,
      value: 2,
    },
  },
  {
    groupId: 0,
    entryId: -1,
    input: {
      channel: 9,
      status: STATUS_NOTE_ON, // STATUS_CHANNEL_PRESSURE,
      value: 64,
    },
    output: {
      channel: 9,
      status: STATUS_NOTE_ON,
      value: 4,
    },
  },
  // GROUP B
  {
    groupId: 1,
    entryId: -1,
    input: {
      channel: 9,
      status: STATUS_CONTROL_CHANGE,
      value: 64,
    },
    output: {
      channel: 9,
      status: STATUS_CONTROL_CHANGE,
      value: 65,
    },
  },
  {
    groupId: 1,
    entryId: -1,
    input: {
      channel: 9,
      status: STATUS_NOTE_ON,
      value: 88,
    },
    output: {
      channel: 9,
      status: STATUS_NOTE_OFF,
      value: 89,
    },
  },
]
