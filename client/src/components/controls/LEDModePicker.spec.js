import React from 'react'
import LEDModePicker from './LEDModePicker'

const setFlags = jest.fn()

const props = {
  selectedValue: 0,
  setFlags,
  disabled: false,
  serialMidiOutEnabled: true,
  usbMidiOutEnabled: true,
}

describe('LEDModePicker tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(LEDModePicker)(props).toMatchSnapshot()
  })

  it('clicking should open the menu', () => {
    const wrapper = shallow(<LEDModePicker {...props} />)
    wrapper.instance().handleClick({ currentTarget: 'target' })
    expect(wrapper.state('anchorEl')).toEqual('target')
  })

  it('clicking a menuitem should change state', () => {
    const wrapper = shallow(<LEDModePicker {...props} />)
    wrapper.instance().handleMenuItemClick(2)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miValue3"]')
      .simulate('click')
    expect(setFlags).toHaveBeenCalledWith(3, true, true)
  })
})
