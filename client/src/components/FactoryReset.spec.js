import shifter from '../../__mocks__/shifter'
import FactoryReset from './FactoryReset'

const confirmFactoryReset = jest.fn()
const performFactoryReset = jest.fn()

const props = {
  shifter,
  confirmFactoryReset,
  performFactoryReset,
}

describe('FactoryReset tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(FactoryReset)(props).toMatchSnapshot()
  })

  it('cancels when clicked', () => {
    const wrapper = shallow(<FactoryReset {...props} />)
    wrapper
      .find('WithStyles(Button)')
      .filter('[tag="btnCancel"]')
      .simulate('click')
    expect(confirmFactoryReset).toHaveBeenCalledWith(false)
  })

  it('proceeds when clicked', () => {
    const wrapper = shallow(<FactoryReset {...props} />)
    wrapper
      .find('WithStyles(Button)')
      .filter('[tag="btnOk"]')
      .simulate('click')
    expect(performFactoryReset).toHaveBeenCalledWith(true)
  })
})
