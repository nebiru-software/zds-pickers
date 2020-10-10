import React from 'react'
import PropTypes from 'prop-types'
import { LatchPicker, PolarityPicker } from 'zds-pickers'
import Led from '../Led'
import { ccControl, picker } from '../../styles/inputControls.scss'
import { pick } from '../../core/fp/objects'
import CCPicker from './CCPicker'
import ChannelPicker from './ChannelPicker'

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

  const pickerProps = {
    ...pick(['channel', 'className', 'latching', 'polarity', 'value'])(props),
    className: picker,
  }

  return (
    <div className={ccControl}>
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
