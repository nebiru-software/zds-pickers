import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import { border, margin, padding } from 'polished'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import Led from 'components/Led'
import { inputControlShape } from 'core/shapes'
import { fallsWithin } from 'fp/numbers'
import { actions } from 'reducers/inputControls'
import CCButton from './CCButton'
import ExpJack from './ExpJack'
import TriggerJack from './TriggerJack'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    ...margin(0, 10),
    ...padding(10, 5, 10),
    ...border(4, 'solid', palette.border),
    color: palette.text.inverted,
    borderRadius: 15,
    '& figure': {
      // LED Container
      padding: 0,
      ...margin(0, 0, 10),
    },

    '& .zds-pickers__label': {
      width: 160,
    },

    '& header': {
      fontWeight: 'bold',
      fontSize: 18,
    },
  },

  name: {
    marginLeft: 10,
  },

  details: {
    ...margin(15, 30, 0, 10),
    color: palette.text.greyed,
    lineHeight: 1.2,
  },
}), { name: 'InputControl' })

const InputControl = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { controlId, details, index, lit, name } = props

  const isButton = fallsWithin(controlId, 0, 2)
  const isExpJack = fallsWithin(controlId, 3, 4)
  const isTrigger = fallsWithin(controlId, 5, 8)

  const handleChangeValue = useCallback((v) => {
    dispatch(actions.changeInputControlValue(controlId, v))
  }, [controlId, dispatch])

  const handleChangeChannel = useCallback((v) => {
    dispatch(actions.changeInputControlChannel(controlId, v))
  }, [controlId, dispatch])

  const handleChangeLatching = useCallback((v) => {
    dispatch(actions.changeInputControlLatching(controlId, v))
  }, [controlId, dispatch])

  const handleChangePolarity = useCallback((v) => {
    dispatch(actions.changeInputControlPolarity(controlId, v))
  }, [controlId, dispatch])

  const handleChangeCalibrationHigh = useCallback((v) => {
    dispatch(actions.changeInputControlCalibrationHigh(controlId, v))
  }, [controlId, dispatch])

  const handleChangeCalibrationLow = useCallback((v) => {
    dispatch(actions.changeInputControlCalibrationLow(controlId, v))
  }, [controlId, dispatch])

  const events = {
    handleChangeCalibrationHigh,
    handleChangeCalibrationLow,
    handleChangeValue,
    handleChangeChannel,
    handleChangeLatching,
    handleChangePolarity,
  }

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid
          item
          xs={4}
        >
          {isButton
            ? (
              <Led
                label={`Button ${index + 1}`}
                lit={lit}
              />
            )
            : (
              <header
                className={classes.name}
                dangerouslySetInnerHTML={{ __html: name[index] }}
              />
            )}

          <div
            className={classes.details}
            dangerouslySetInnerHTML={{ __html: details[index] }}
          />
        </Grid>

        <Grid
          item
          xs={8}
        >
          {Boolean(isButton) && (
            <CCButton
              {...props}
              {...events}
            />
          )}

          {Boolean(isExpJack) && (
            <ExpJack
              {...props}
              {...events}
            />
          )}

          {Boolean(isTrigger) && (
            <TriggerJack
              {...props}
              {...events}
            />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

InputControl.propTypes = {
  ...inputControlShape.isRequired,

}

export default InputControl
