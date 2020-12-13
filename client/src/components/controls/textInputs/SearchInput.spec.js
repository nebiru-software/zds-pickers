import { compose } from 'redux'
import faker from 'faker'
import { act } from 'react-dom/test-utils'
import ss from '../../../../styles/themes/ss'
import SearchInput from './SearchInput'

describe('<SearchInput />', () => {
  const defaultProps = { classes: {} }

  const getWrapper = compose(
    mount,
    wrapTheme({ theme: ss({}) }),
    createElement(SearchInput),
    withProps(defaultProps),
  )

  it('should respond to changes', () => {
    const onChange = jest.fn()
    const wrapper = getWrapper({ onChange })
    const value = faker.lorem.words(10)
    act(() => {
      wrapper
        .find('Enhanced')
        .props()
        .onChange({ target: { value } })
    })
    wrapper.update()

    expect(onChange).toHaveBeenCalledWith(value)
  })
})
