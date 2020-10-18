import React from 'react'
import PropTypes from 'prop-types'
import { LatchPicker, PolarityPicker } from 'zds-pickers'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border, margin, padding } from 'polished'
import Led from '../Led'
// import { ccControl, picker } from '../../styles/inputControls.scss'
import { pick } from '../../core/fp/objects'
import CCPicker from './CCPicker'
import ChannelPicker from './ChannelPicker'

const useStyles = makeStyles(({ mixins: { importantPx }, palette }) => ({
  root: {
    ...margin(0, 10),
    ...padding(10, 5, 10),
    ...border(4, 'solid', palette.border),
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
  picker: {
    minWidth: 179,
    '& input': {
      backgroundColor: palette.accentLight, // 'lighten($color-shifter-red, 5)',
      color: palette.text.inverted,
      ...padding(4, 6),
      borderRadius: 5,
    },
    '& ul': {
      maxHeight: importantPx(160),
    },
  },
}), { name: 'CCControl' })

const CCControl = (props) => {
  const {
    changeInputControlChannel,
    changeInputControlLatching,
    changeInputControlPolarity,
    changeInputControlValue,
    controlId,
    lit,
    ...rest
  } = props

  const classes = useStyles()

  const pickerProps = {
    ...pick(['channel', 'className', 'latching', 'polarity', 'value'])(props),
    className: classes.picker,
  }

  return (
    <div className={classes.root}>
      <Led
        label={`FS${controlId + 1}`}
        lit={lit}
        {...rest}
      />
      <CCPicker
        {...pickerProps}
        onChange={value => changeInputControlValue(controlId, value)}
      />
      <ChannelPicker
        {...pickerProps}
        onChange={channel => changeInputControlChannel(controlId, channel)}
      />
      <LatchPicker
        {...pickerProps}
        onChange={latching => changeInputControlLatching(controlId, latching)}
      />
      <PolarityPicker
        {...pickerProps}
        labelOff={pickerProps.latching ? 'Initially Off' : 'Normally Off'}
        labelOn={pickerProps.latching ? 'Initially On' : 'Normally On'}
        onChange={polarity => changeInputControlPolarity(controlId, polarity)}
      />
    </div>
  )
}

CCControl.propTypes = {
  lit: PropTypes.bool.isRequired,
  controlId: PropTypes.number.isRequired,
  changeInputControlChannel: PropTypes.func.isRequired,
  changeInputControlValue: PropTypes.func.isRequired,
  changeInputControlLatching: PropTypes.func.isRequired,
  changeInputControlPolarity: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  latching: PropTypes.oneOf([0, 1]).isRequired,
  polarity: PropTypes.oneOf([0, 1]).isRequired,
}

export default CCControl