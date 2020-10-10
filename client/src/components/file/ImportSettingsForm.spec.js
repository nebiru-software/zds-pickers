import ImportSettingsForm from './ImportSettingsForm'

const handleSubmit = jest.fn()

const props = {
  handleSubmit,
}

describe('ImportSettingsForm tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(ImportSettingsForm)(props).toMatchSnapshot()
  })
})
