import { shifter } from '../../../__mocks__'
import { NotResponding, mapStateToProps } from './NotResponding'

const props = {
  shifter,
}

describe('NotResponding tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(NotResponding)(props).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })
})
