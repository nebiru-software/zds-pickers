/* eslint-disable import/order */
import '@config/testingLibrary'
import { compose } from 'redux'
import TextEdit from './TextEdit'

const fp = require('fp/utils')

describe('<TextEdit />', () => {
  const onChange = jest.fn()
  const maxLength = 140
  const defaultProps = {
    onChange,
    maxLength,
  }

  fp.debounce = jest.fn((timeout, f) => f)

  beforeEach(jest.clearAllMocks)
  afterEach(cleanup)

  const getWrapper = compose(
    render,
    wrapTheme(),
    createElement(TextEdit),
    withProps(defaultProps),
  )

  it('should handle changes', () => {
    const wrapper = getWrapper({ showCharsLeft: true })
    const value = 'some text'

    const event = { target: { value }, bubbles: true }
    fireEvent.input(document.querySelector('textarea'), event)

    expect(fp.debounce).toHaveBeenCalledTimes(1)
    expect(wrapper.queryByText(value)).toBeTruthy()

    expect(wrapper.getByText(String(maxLength - value.length), { exact: false })).toBeTruthy()
  })

  it('should render "Characters Left" when requested', () => {
    expect(getWrapper({ showCharsLeft: false }).queryByTestId('chars-left-label')).toBeFalsy()
    expect(getWrapper({ showCharsLeft: true }).queryByTestId('chars-left-label')).toBeTruthy()
  })
})
