import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  ACTIVITY_LED_MODE_ALWAYS_OFF,
  ACTIVITY_LED_MODE_ALWAYS_ON,
  ACTIVITY_LED_MODE_NORMALLY_OFF,
  ACTIVITY_LED_MODE_NORMALLY_ON,
} from '../midi/sysex'
import { shifterShape } from '../core/shapes'
import Led from './Led'

export const isLit = ({ midiInActivity, midiOutActivity, midiActivityLEDMode }) => {
  switch (midiActivityLEDMode) {
    case ACTIVITY_LED_MODE_NORMALLY_ON:
      return !midiInActivity && !midiOutActivity
    case ACTIVITY_LED_MODE_NORMALLY_OFF:
      return midiInActivity || midiOutActivity
    case ACTIVITY_LED_MODE_ALWAYS_ON:
      return true
    case ACTIVITY_LED_MODE_ALWAYS_OFF:
    default:
      return false
  }
}

export const MidiActivity = ({ shifter, label }) => (
  <div style={{ margin: '8px 7px 0 0' }}>
    <Led
      isMidiActivity
      label={label}
      lit={isLit(shifter)}
    />
  </div>
)

MidiActivity.propTypes = {
  label: PropTypes.string.isRequired,
  shifter: shifterShape.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })

export default connect(mapStateToProps)(MidiActivity)
