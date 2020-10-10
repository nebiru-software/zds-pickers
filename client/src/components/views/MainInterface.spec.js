import WrappedMainInterface from './MainInterface'

const MainInterface = WrappedMainInterface.DecoratedComponent

describe('MainInterface tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(MainInterface)({}).toMatchSnapshot()
  })
})
