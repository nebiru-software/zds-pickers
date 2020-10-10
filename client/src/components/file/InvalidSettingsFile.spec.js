import InvalidSettingsFile from './InvalidSettingsFile'

const acknowledgeInvalidFile = jest.fn()

const props = {
  acknowledgeInvalidFile,
}

describe('InvalidSettingsFile tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(InvalidSettingsFile)(props).toMatchSnapshot()
  })
})
