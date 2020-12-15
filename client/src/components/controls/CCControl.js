import { useCallback } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border, margin, padding } from 'polished'
import { useDispatch } from 'react-redux'
import { CCPicker, ChannelPicker, LatchPicker, PolarityPicker } from 'zds-pickers'
import Led from 'components/Led'
import { actions } from 'reducers/inputControls'

const useStyles = makeStyles(({ mixins: { importantPx, rem }, palette }) => ({
  root: {
    ...margin(0, 10),
    ...padding(10, 5, 10),
    ...border(4, 'solid', palette.border),
    width: 180,
    borderRadius: 15,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'center',

    '& figure': {
      // LED Container
      padding: 0,
      ...margin(0, 0, 10),
      '& header': {
        fontWeight: 'bold',
        fontSize: 18,
      },
    },
  },
}), { name: 'CCControl' })

const CCControl = (props) => {
  const dispatch = useDispatch()
  const {
    channel,
    controlId,
    latching,
    lit,
    // changeInputControlChannel,
    // changeInputControlLatching,
    // changeInputControlPolarity,
    // changeInputControlValue,
    polarity,
    value,
  } = props

  const handleChangeValue = useCallback((v) => {
    console.log('in callback')

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

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Led
        label={`FS${controlId + 1}`}
        lit={lit}
      />
      <CCPicker
        onChange={handleChangeValue}
        value={value}
      />
      <ChannelPicker
        onChange={handleChangeChannel}
        value={channel}
      />
      <LatchPicker
        onChange={handleChangeLatching}
        value={latching}
      />
      <PolarityPicker
        labelOff={latching ? 'Initially Off' : 'Normally Off'}
        labelOn={latching ? 'Initially On' : 'Normally On'}
        onChange={handleChangePolarity}
        value={polarity}
      />
    </div>
  )
}

CCControl.propTypes = {
  lit: PropTypes.bool.isRequired,
  channel: PropTypes.number.isRequired,
  controlId: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  latching: PropTypes.oneOf([0, 1]).isRequired,
  polarity: PropTypes.oneOf([0, 1]).isRequired,
}

export default CCControl
