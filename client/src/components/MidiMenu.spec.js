import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import { shifter } from '../../__mocks__'
import { MidiMenu, mapDispatchToProps, mapStateToProps } from './MidiMenu'

describe('MidiMenu tests', () => {
  const setFlags = jest.fn()
  const props = {
    shifter,
    setFlags,
  }

  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(MidiMenu)(props).toMatchSnapshot()
  })

  it('renders correctly in alternate modes', () => {
    shallowExpect(MidiMenu)(flow(
      set('shifter.serialMidiOutEnabled', false),
      set('shifter.usbMidiOutEnabled', false),
    )(props)).toMatchSnapshot()
  })

  it('clicking should open the menu', () => {
    const wrapper = shallow(<MidiMenu {...props} />)
    wrapper.find('WithStyles(IconButton)').simulate('click', { currentTarget: 'target' })
    expect(wrapper.state('anchorEl')).toEqual('target')
  })

  it('clicking should hide the menu when closing', () => {
    const wrapper = shallow(<MidiMenu {...props} />)
    wrapper.setState({ anchorEl: 'target' })
    wrapper.instance().handleClose()
    expect(wrapper.state('anchorEl')).toBeNull()
  })

  it('should update flags when items miDinOut is clicked', () => {
    const wrapper = shallow(<MidiMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miDinOut"]')
      .simulate('click')
    expect(setFlags).toHaveBeenCalledWith(shifter.midiActivityLEDMode, true, false)
  })

  it('should update flags when items miUsbOut is clicked', () => {
    const wrapper = shallow(<MidiMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miUsbOut"]')
      .simulate('click')
    expect(setFlags).toHaveBeenCalledWith(shifter.midiActivityLEDMode, false, true)
  })

  it('should update flags when items miBothOut is clicked', () => {
    const wrapper = shallow(<MidiMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miBothOut"]')
      .simulate('click')
    expect(setFlags).toHaveBeenCalledWith(shifter.midiActivityLEDMode, true, true)
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).setFlags(3, true, false)
    expect(dispatch.mock.calls[0][0]).toEqual({
      midiActivityLEDMode: 3,
      serialMidiOutEnabled: true,
      type: 'SET_FLAGS',
      usbMidiOutEnabled: false,
    })
  })
})
