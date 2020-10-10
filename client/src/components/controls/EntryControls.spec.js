import React from 'react'
import set from 'lodash/fp/set'
import { STATUS_CONTROL_CHANGE } from 'zds-pickers'
import { STATUS_NOTE_ON } from 'zds-pickers/dist/midi/statuses'
import { mappings, shiftGroups } from '../../../__mocks__'
import EntryControls from './EntryControls'

const changeStatus = jest.fn()
const changeChannel = jest.fn()
const changeValue = jest.fn()
const onSubmit = jest.fn()
const group = shiftGroups.groups[0]
const focus = jest.fn()
const okButtonRef = { current: { focus } }

const props = {
  group,
  changeStatus,
  changeChannel,
  changeValue,
  onSubmit,
  mappings,
  okButtonRef,
}

describe('EntryControls tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(EntryControls)(props).toMatchSnapshot()
  })

  it('pressing enter submits if output status is CC and is this control is for input', () => {
    const localProps = set('group.editQueue.output.status', STATUS_CONTROL_CHANGE)(props)
    const instance = mount(<EntryControls {...localProps} />).instance()
    instance.onPressedEnter(true, false, okButtonRef)
    expect(focus).toHaveBeenCalled()
  })

  it('pressing enter submits if output status is NOT CC and this control is for output', () => {
    const localProps = set('group.editQueue.output.status', STATUS_NOTE_ON)(props)
    const instance = mount(<EntryControls {...localProps} />).instance()
    instance.onPressedEnter(false, false, okButtonRef)
    expect(focus).toHaveBeenCalled()
  })

  it('pressing enter focuses if output status is not CC and this control is for input', () => {
    const localProps = set('group.editQueue.output.status', STATUS_NOTE_ON)(props)
    const instance = mount(<EntryControls {...localProps} />).instance()
    instance.onPressedEnter(true, false, okButtonRef)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
