import { random } from 'faker'
import { compose } from 'redux'
import ss from 'styles/themes/ss'
import usa from 'styles/themes/usa'
import OutlinedInput from './OutlinedInput'

describe('<OutlinedInput />', () => {
  const name = random.word()
  const label = random.words(3)

  const defaultProps = {
    name,
    label,
  }

  beforeEach(jest.resetAllMocks)

  const getWrapper = (theme = ss) => compose(
    mount,
    wrapTheme({ theme: theme({}) }),
    createElement(OutlinedInput),
    withProps(defaultProps),
  )

  it('should render props', () => {
    const wrapper = getWrapper()()
    expect(wrapper.find('label').text()).toBe(label)
    expect(wrapper.find('TextField').prop('name')).toBe(name)
  })

  it('should render differently for the high-contrast theme', () => {
    getWrapper(usa)()
    // TODO: How do we check?  All it does is change the borderColor in the built styles
  })
})
