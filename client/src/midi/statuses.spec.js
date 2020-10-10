import {
  STATUS_AFTER_TOUCH,
  STATUS_CHANNEL_PRESSURE,
  STATUS_CONTROL_CHANGE,
  STATUS_NOTE_OFF,
  STATUS_NOTE_ON,
  STATUS_PITCH_WHEEL,
  STATUS_PROGRAM_CHANGE,
  getStatusLabel,
} from 'zds-pickers'

describe('statuses', () => {
  it('getStatusLabel should work', () => {
    expect(getStatusLabel(STATUS_NOTE_OFF)).toEqual('Note Stack')
    expect(getStatusLabel(STATUS_NOTE_ON)).toEqual('Note On')
    expect(getStatusLabel(STATUS_AFTER_TOUCH)).toEqual('Aftertouch')
    expect(getStatusLabel(STATUS_CONTROL_CHANGE)).toEqual('Control Change')
    expect(getStatusLabel(STATUS_PROGRAM_CHANGE)).toEqual('Program Change')
    expect(getStatusLabel(STATUS_CHANNEL_PRESSURE)).toEqual('Channel Pressure')
    expect(getStatusLabel(STATUS_PITCH_WHEEL)).toEqual('Pitch Wheel')
  })
})
