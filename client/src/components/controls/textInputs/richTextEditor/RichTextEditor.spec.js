import { compose } from 'redux'
import RichTextEditor from './RichTextEditor'

describe('<RichTextEditor />', () => {
  beforeEach(jest.clearAllMocks)
  const value = '<h1>header</h1><p>paragraph <strong>strong</strong> text</p>'
  const onChange = jest.fn()
  const props = { value, onChange }

  it('should render', () => {
    const wrapper = compose(
      mount,
      wrapTheme(),
      createElement(RichTextEditor),
    )
    expect((wrapper)(props)).toMatchSnapshot()
  })
})
