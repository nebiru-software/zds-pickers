import { inputControls, shifter, store, version } from '../../../__mocks__'
import CCButtons, { mapDispatchToProps, mapStateToProps } from './CCButtons'

const setFlags = jest.fn()

const props = {
  inputControls,
  version,
  shifter,
  setFlags,
}

describe('CCButtons tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(CCButtons)(props).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    expect(mapStateToProps(store)).toEqual({ inputControls, shifter, version })
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).setFlags(3, true, false)
    expect(dispatch.mock.calls[0][0]).toEqual({
      midiActivityLEDMode: 3,
      serialMidiOutEnabled: true,
      type: 'SET_FLAGS',
      usbMidiOutEnabled: false,
    })
  })
})
