import { shifter } from '../../__mocks__'
import {
  ACTIVITY_LED_MODE_ALWAYS_OFF,
  ACTIVITY_LED_MODE_ALWAYS_ON,
  ACTIVITY_LED_MODE_NORMALLY_OFF,
  ACTIVITY_LED_MODE_NORMALLY_ON,
} from '../midi/sysex'
import { MidiActivity, isLit, mapStateToProps } from './MidiActivity'

describe('MidiActivity tests', () => {
  const props = {
    shifter,
    label: 'label',
  }

  it('renders correctly', () => {
    shallowExpect(MidiActivity)(props).toMatchSnapshot()
  })

  it('lights up correctly for ACTIVITY_LED_MODE_NORMALLY_ON', () => {
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_ON,
    })).toBe(true)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_ON,
    })).toBe(false)
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_ON,
    })).toBe(false)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_ON,
    })).toBe(false)
  })

  it('lights up correctly for ACTIVITY_LED_MODE_NORMALLY_OFF', () => {
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_OFF,
    })).toBe(false)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_OFF,
    })).toBe(true)
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_OFF,
    })).toBe(true)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_NORMALLY_OFF,
    })).toBe(true)
  })

  it('lights up correctly for ACTIVITY_LED_MODE_ALWAYS_ON', () => {
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_ON,
    })).toBe(true)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_ON,
    })).toBe(true)
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_ON,
    })).toBe(true)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_ON,
    })).toBe(true)
  })

  it('lights up correctly for ACTIVITY_LED_MODE_ALWAYS_OFF', () => {
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_OFF,
    })).toBe(false)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: false,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_OFF,
    })).toBe(false)
    expect(isLit({
      midiInActivity: false,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_OFF,
    })).toBe(false)
    expect(isLit({
      midiInActivity: true,
      midiOutActivity: true,
      midiActivityLEDMode: ACTIVITY_LED_MODE_ALWAYS_OFF,
    })).toBe(false)
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })
})
