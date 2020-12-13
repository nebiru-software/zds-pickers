import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { margin, padding } from 'polished'
import InputControl from '../controls/InputControl'
import MidiActivity from '../MidiActivity'
import LEDModePicker from '../controls/LEDModePicker'
import MidiMenu from '../MidiMenu'
import WaitingOnShifter from '../WaitingOnShifter'
import { stateInputControls, stateShifter } from '../../selectors'

const width = 680

const useStyles = makeStyles(({ constants, palette }) => ({
  root: {
    height: constants.inputControlsHeight,
    ...margin(0, 50),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.text.inverted,

    '& > div': {
      minWidth: width,
      maxWidth: width,
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
        minWidth: width,
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

export const InputControls = () => {
  const inputControls = useSelector(stateInputControls)
  const {
    found,
    midiActivityLEDMode,
    ready,
    responding,
    serialMidiOutEnabled,
    usbMidiOutEnabled,
  } = useSelector(stateShifter)

  const classes = useStyles()

  const visibleControls = inputControls.filter((control, idx) => idx < 3)

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

export default InputControls
