import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import InputControl from '../controls/InputControl'
import MidiActivity from '../MidiActivity'
import LEDModePicker from '../controls/LEDModePicker'
import MidiMenu from '../MidiMenu'
import { actions as inputControlActions } from '../../reducers/inputControls'
import { actions as shifterActions } from '../../reducers/shifter'
import { inputControls as controlsClass, midiLedCont } from '../../styles/inputControls.scss'
import { inputControlShape, shifterShape, versionShape } from '../../shapes'
import WaitingOnShifter from '../WaitingOnShifter'

export const InputControls = (props) => {
  const {
    inputControls,
    setFlags,
    shifter: { midiActivityLEDMode, ready, found, responding, serialMidiOutEnabled, usbMidiOutEnabled },
    version: { proModel },
  } = props

  const visibleControls = inputControls.filter((control, idx) => proModel || idx < 2)

  return (
    <div className={controlsClass}>
      <div>
        {ready ? (
          <>
            <Grid
              alignItems="center"
              container
              justify="space-between"
            >
              <Grid item>
                {visibleControls.length > 0 && ready && (
                  <div className={midiLedCont}>
                    <LEDModePicker
                      selectedValue={midiActivityLEDMode}
                      serialMidiOutEnabled={serialMidiOutEnabled}
                      setFlags={setFlags}
                      usbMidiOutEnabled={usbMidiOutEnabled}
                    >
                      <MidiActivity label="PWR/Midi" />
                    </LEDModePicker>
                  </div>
                )}
              </Grid>
              <Grid item>
                {visibleControls.length > 0 && ready && (
                  <div
                    className={midiLedCont}
                    style={{ marginRight: 10 }}
                  >
                    <MidiMenu />
                  </div>
                )}
              </Grid>
            </Grid>
            <section>
              {visibleControls.map((control, idx) => (
                <InputControl
                  key={idx}
                  {...control}
                  {...props}
                  layout={idx === 1 ? 'right' : 'left'}
                />
              ))}
            </section>
          </>
        ) : (
          <section>{found && responding && <WaitingOnShifter />}</section>
        )}
      </div>
    </div>
  )
}

InputControls.propTypes = {
  inputControls: PropTypes.arrayOf(inputControlShape).isRequired,
  version: versionShape.isRequired,
  shifter: shifterShape.isRequired,
  setFlags: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ inputControls, version, shifter }) => ({
  inputControls,
  version,
  shifter,
})

export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    //
    ...inputControlActions,
    ...shifterActions,
  },
  dispatch,
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputControls)
