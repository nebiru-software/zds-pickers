import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import { FormInput } from './FormInput'

const onChange = jest.fn()
const onBlur = jest.fn()

const input = { value: '', onChange, onBlur }
const meta = { touched: false, error: '', warning: '' }

const props = {
  input,
  meta,
  label: '',
  type: 'input',
  classes: {},
}

describe('FormInput tests', () => {
  it('renders correctly', () => {
    shallowExpect(FormInput)(props).toMatchSnapshot()
  })

  it('should render an error when touched', () => {
    const localProps = flow(
      set('meta.error', 'error'),
      set('meta.touched', true),
    )(props)
    shallowExpect(FormInput)(localProps).toMatchSnapshot()
  })

  it('should render a warning when touched', () => {
    const localProps = flow(
      set('meta.warning', 'warning'),
      set('meta.touched', true),
    )(props)
    shallowExpect(FormInput)(localProps).toMatchSnapshot()
  })
})
