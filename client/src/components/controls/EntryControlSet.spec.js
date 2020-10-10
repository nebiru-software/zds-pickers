import React from 'react'
import set from 'lodash/fp/set'
import { STATUS_CONTROL_CHANGE, STATUS_NOTE_ON } from 'zds-pickers'
import { mappings } from '../../../__mocks__'
import EntryControlSet from './EntryControlSet'

const changeStatus = jest.fn()
const changeValue = jest.fn()
const changeChannel = jest.fn()
const onPressedEnter = jest.fn()

const okButtonRef = {}

const isInput = false
const groupId = 0

const entry = {
  channel: 9,
  status: 13,
  value: 22,
}

const otherEntry = {
  channel: 9,
  status: 23,
  value: 44,
}

const props = {
  isInput,
  entry,
  groupId: 0,
  changeStatus,
  changeValue,
  changeChannel,
  onPressedEnter,
  mappings,
  otherEntry,
  okButtonRef,
}

describe('EntryControlSet tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly as output', () => {
    shallowExpect(EntryControlSet)(set('isInput', false)(props)).toMatchSnapshot()
  })

  it('renders correctly as input', () => {
    shallowExpect(EntryControlSet)(set('isInput', true)(props)).toMatchSnapshot()
  })

  it('renders correctly when status is NOTE ON', () => {
    shallowExpect(EntryControlSet)(set('entry.status', STATUS_NOTE_ON)(props)).toMatchSnapshot()
  })

  it('renders correctly when status is CC', () => {
    shallowExpect(EntryControlSet)(set('entry.status', STATUS_CONTROL_CHANGE)(props)).toMatchSnapshot()
  })

  it('responds to status change', () => {
    const wrapper = shallow(<EntryControlSet {...props} />)
    wrapper.find('StatusPicker').simulate('change', 45)
    expect(changeStatus).toHaveBeenCalledWith(groupId, isInput, 45)
  })

  it('responds to channel change', () => {
    const wrapper = shallow(<EntryControlSet {...props} />)
    wrapper.find('WithStyles(ChannelPicker)').simulate('change', 11)
    expect(changeChannel).toHaveBeenCalledWith(groupId, isInput, 11)
  })

  it('responds to value change', () => {
    const wrapper = shallow(<EntryControlSet {...props} />)
    wrapper.find('ValuePicker').simulate('change', 3)
    expect(changeValue).toHaveBeenCalledWith(groupId, isInput, 3)
  })

  it('responds to enter being pressed', () => {
    const wrapper = shallow(<EntryControlSet {...props} />)
    wrapper.find('ValuePicker').simulate('keydown', { key: 'Enter', preventDefault: f => f })
    expect(onPressedEnter).toHaveBeenCalledWith(isInput, false, okButtonRef)
  })

  it('responds to tab being pressed', () => {
    const wrapper = shallow(<EntryControlSet {...props} />)
    wrapper.find('ValuePicker').simulate('keydown', { key: 'Tab', preventDefault: f => f })
    expect(onPressedEnter).toHaveBeenCalledWith(isInput, true, okButtonRef)
  })
})
