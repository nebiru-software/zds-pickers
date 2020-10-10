import { shifter } from '../../__mocks__'
import { ErrorDialog, mapDispatchToProps, mapStateToProps } from './ErrorDialog'

const dismissError = jest.fn()

const props = {
  shifter,
  dismissError,
}

describe('ErrorDialog tests', () => {
  it('renders correctly', () => {
    shallowExpect(ErrorDialog)(props).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).dismissError()
    expect(dispatch.mock.calls[0][0]).toEqual({ type: 'DISMISS_ERROR' })
  })
})
