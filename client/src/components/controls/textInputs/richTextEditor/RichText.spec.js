import RichText from './RichText'

describe('<RichText />', () => {
  beforeEach(jest.clearAllMocks)
  const value = '<h1>header</h1><p>paragraph <strong>strong</strong> text</p>'
  const onChange = jest.fn()
  const props = { value, onChange }

  it('should render', () => {
    shallowExpect(RichText)(props).toMatchSnapshot()
  })
})
