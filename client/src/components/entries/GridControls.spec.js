import React from 'react'
import set from 'lodash/fp/set'
import { mappings, shiftGroups, shifter, user } from '../../../__mocks__'
import { GridControls } from './GridControls'

describe('GridControls tests', () => {
  const changeGroupChannel = jest.fn()
  const changeGroupValue = jest.fn()
  const addEntry = jest.fn()
  const showMappingsDialog = jest.fn()
  const hideMappingsDialog = jest.fn()
  const changeMapping = jest.fn()
  const showUserMappingsDialog = jest.fn()
  const hideUserMappingsDialog = jest.fn()
  const reportError = jest.fn()
  const importMapping = jest.fn()
  const deleteMapping = jest.fn()

  const group = shiftGroups.groups[0]

  const props = {
    changeGroupChannel,
    changeGroupValue,
    addEntry,
    classes: {},
    disabled: false,
    mappings,
    showMappingsDialog,
    hideMappingsDialog,
    changeMapping,
    showUserMappingsDialog,
    hideUserMappingsDialog,
    reportError,
    importMapping,
    deleteMapping,
    shifter,
    user,
    totalEntries: 0,
    maxEntries: 112,
    ...group,
  }

  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(GridControls)(props).toMatchSnapshot()
  })

  it('renders correctly when there is no mapping for the channel', () => {
    shallowExpect(GridControls)(set('channel', 0)(props)).toMatchSnapshot()
  })

  it('should show mapping editor when clicked', () => {
    const wrapper = shallow(<GridControls {...props} />)

    wrapper
      .find('WithStyles(Button)')
      .at(0)
      .simulate('click', { preventDefault: f => f })
    expect(showMappingsDialog).toHaveBeenCalled()
  })

  it('should start creating an entry if you press "n"', () => {
    const map = {}
    const preventDefault = jest.fn()
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb
    })

    shallow(<GridControls {...props} />)

    map.keydown({ key: 'q' })
    expect(addEntry).not.toHaveBeenCalled()

    map.keydown({ key: 'n', preventDefault })
    expect(addEntry).toHaveBeenCalledWith(group.groupId)
    expect(preventDefault).toHaveBeenCalled()
  })

  it('should change the value', () => {
    const wrapper = shallow(<GridControls {...props} />)
    const value = 32
    // console.log(wrapper.debug())

    wrapper.find('WithStyles(CCPicker)').simulate('change', value)
    expect(changeGroupValue).toHaveBeenCalledWith(group.groupId, value)
  })

  it('should change the channel', () => {
    const wrapper = shallow(<GridControls {...props} />)
    const channel = 7
    wrapper.find('WithStyles(ChannelPicker)').simulate('change', channel)
    expect(changeGroupChannel).toHaveBeenCalledWith(group.groupId, channel)
  })

  it('should start creating an entry if you click the button', () => {
    const wrapper = shallow(<GridControls {...props} />)
    wrapper
      .find('WithStyles(Button)')
      .at(1)
      .simulate('click')
    expect(addEntry).toHaveBeenCalledWith(group.groupId)
  })
})
