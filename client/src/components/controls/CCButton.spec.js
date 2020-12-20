import set from 'lodash/fp/set'
import flow from 'lodash/fp/flow'
import CCButton from './CCButton'

const changeInputControlChannel = jest.fn()
const changeInputControlValue = jest.fn()
const changeInputControlLatching = jest.fn()
const changeInputControlPolarity = jest.fn()

const controlId = 3

const props = {
  lit: false,
  controlId,
  changeInputControlChannel,
  changeInputControlValue,
  changeInputControlLatching,
  changeInputControlPolarity,
  disabled: false,
  value: 12,
  latching: 1,
  polarity: 0,
}

describe('CCControl tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(CCButton)(props).toMatchSnapshot()
  })

  it('renders alternate mode correctly', () => {
    shallowExpect(CCButton)(flow(
      set('latching', 0),
      set('polarity', 1),
    )(props)).toMatchSnapshot()
  })

  it('responds to CC changes', () => {
    const wrapper = shallow(<CCButton {...props} />)
    wrapper.find('WithStyles(CCPicker)').simulate('change', 13)
    expect(changeInputControlValue).toHaveBeenCalledWith(controlId, 13)
  })

  it('responds to channel changes', () => {
    const wrapper = shallow(<CCButton {...props} />)
    wrapper.find('WithStyles(ChannelPicker)').simulate('change', 9)
    expect(changeInputControlChannel).toHaveBeenCalledWith(controlId, 9)
  })

  it('responds to latching changes', () => {
    const wrapper = shallow(<CCButton {...props} />)
    wrapper.find('LatchPicker').simulate('change', 0)
    expect(changeInputControlLatching).toHaveBeenCalledWith(controlId, 0)
  })

  it('responds to polarity changes', () => {
    const wrapper = shallow(<CCButton {...props} />)
    wrapper.find('PolarityPicker').simulate('change', 1)
    expect(changeInputControlPolarity).toHaveBeenCalledWith(controlId, 1)
  })
})
