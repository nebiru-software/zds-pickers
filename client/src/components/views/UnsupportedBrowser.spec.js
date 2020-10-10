import UnsupportedBrowser from './UnsupportedBrowser'

describe('UnsupportedBrowser tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(UnsupportedBrowser)({}).toMatchSnapshot()
  })
})
