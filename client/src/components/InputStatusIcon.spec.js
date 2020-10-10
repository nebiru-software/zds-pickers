import React from 'react'
import { STATUS_CONTROL_CHANGE, STATUS_NOTE_OFF } from 'zds-pickers'
import InputStatusIcon from './InputStatusIcon'

describe('InputStatusIcon component', () => {
  it('renders as STATUS_NOTE_OFF', () => {
    expect(shallow(<InputStatusIcon status={STATUS_NOTE_OFF} />) //
      .find('i.material-icons').length).toBe(1)

    expect(shallow(<InputStatusIcon status={STATUS_NOTE_OFF} />) //
      .contains('library_add')).toBe(true)
  })

  it('renders as STATUS_CONTROL_CHANGE', () => {
    expect(shallow(<InputStatusIcon status={STATUS_CONTROL_CHANGE} />) //
      .find('i.material-icons').length).toBe(1)

    expect(shallow(<InputStatusIcon status={STATUS_CONTROL_CHANGE} />) //
      .contains('forward')).toBe(true)
  })
})
