import set from 'lodash/fp/set'
import { inputControls } from '../../../__mocks__'
import InputControl from './InputControl'

const inputControl = inputControls[0]
const changeInputControlChannel = jest.fn()
const changeInputControlValue = jest.fn()
const changeInputControlLatching = jest.fn()
const changeInputControlPolarity = jest.fn()

const props = {
  ...inputControl,
  changeInputControlChannel,
  changeInputControlValue,
  changeInputControlLatching,
  changeInputControlPolarity,
  disabled: false,
}

describe('InputControl tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(InputControl)(props).toMatchSnapshot()
  })

  it('renders correctly for controls outside the current range', () => {
    shallowExpect(InputControl)(set('controlId', 3)(props)).toMatchSnapshot()
  })
})
