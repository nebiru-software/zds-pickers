import Led from './Led'

describe('Led tests', () => {
  it('renders correctly', () => {
    shallowExpect(Led)({ label: 'label', lit: false }).toMatchSnapshot()
  })

  it('should render when lit', () => {
    shallowExpect(Led)({ label: 'label', lit: true }).toMatchSnapshot()
  })
})
