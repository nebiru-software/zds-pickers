import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { margin, padding } from 'polished'
import InputControl from '../controls/InputControl'
import MidiActivity from '../MidiActivity'
import LEDModePicker from '../controls/LEDModePicker'
import MidiMenu from '../MidiMenu'
import { actions as inputControlActions } from '../../reducers/inputControls'
import { actions as shifterActions } from '../../reducers/shifter'
import { inputControlShape, shifterShape, versionShape } from '../../core/shapes'
import WaitingOnShifter from '../WaitingOnShifter'

const inputControlsHeight = 280

const useStyles = makeStyles(({ palette }) => ({
  root: {
    height: inputControlsHeight,
    ...margin(0, 50),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.text.inverted,

    '& > div': {
      maxWidth: 500,
      minHeight: 250,
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'flex-start',
      borderRadius: 15,
      ...padding(0, 10),
      backgroundColor: palette.accentLight,
      // @include dropShadow($color-shadow, 3px);

      '& > section': {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: 490,
        minHeight: 200,
      },
    },
  },
  midiLedCont: {
    display: 'flex',
    flexFlow: 'row nowrap',
    ...margin(8, 0, 0, 10),
    ...padding(15, 2, 0, 8),
    borderRadius: 6,
    backgroundColor: palette.accent,
    // boxShadow: 'inset 1px 1px 0 $color-shifter-red-accent',
    maxHeight: 29,

    '& svg': {
      marginTop: 5,
    },

    '& button': {
      margin: 0,
      padding: 0,
      position: 'relative',
      top: -6,
      color: palette.text.inverted,
      fontSize: 14,
      '& svg': {
        fill: palette.text.inverted,
      },
    },
  },
}), { name: 'InputControls' })

export const InputControls = (props) => {
  const {
    inputControls,
    setFlags,
    shifter: { midiActivityLEDMode, ready, found, responding, serialMidiOutEnabled, usbMidiOutEnabled },
    version: { proModel },
  } = props

  const classes = useStyles()

  const visibleControls = inputControls.filter((control, idx) => proModel || idx < 2)

  return (
    <div className={classes.root}>
      <div>
        {ready ? (
          <>
            <Grid
              alignItems="center"
              container
              justify="space-between"
            >
              <Grid item>
                {Boolean(visibleControls.length > 0 && ready) && (
                  <div className={classes.midiLedCont}>
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
                {Boolean(visibleControls.length > 0 && ready) && (
                  <div
                    className={classes.midiLedCont}
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
          <section>{Boolean(found && responding) && <WaitingOnShifter />}</section>
        )}
      </div>
    </div>
  )
}

InputControls.propTypes = {
  inputControls: PropTypes.array.isRequired, // PropTypes.arrayOf(inputControlShape).isRequired,
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
