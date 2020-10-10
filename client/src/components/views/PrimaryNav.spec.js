import PrimaryNav from './PrimaryNav'

describe('PrimaryNav tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(PrimaryNav)({}).toMatchSnapshot()
  })
})
