import { shifter } from '../../../__mocks__'
import { NoShifterFound, mapStateToProps } from './NoShifterFound'

const props = {
  shifter,
}

describe('NoShifterFound tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(NoShifterFound)(props).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })
})
