import { CCPicker, ChannelPicker, PolarityPicker, ValuePicker } from 'zds-pickers'
import { inputControlShape, inputEventsShape } from 'core/shapes'

const ExpJack = (props) => {
  const {
    calibrationHigh,
    calibrationLow,
    channel,
    handleChangeCalibrationHigh,
    handleChangeCalibrationLow,
    handleChangeChannel,
    handleChangePolarity,
    handleChangeValue,
    polarity,
    value,
  } = props

  return (
    <>
      <CCPicker
        label="CC #"
        onChange={handleChangeValue}
        value={value}
      />
      <ChannelPicker
        label="Channel"
        onChange={handleChangeChannel}
        value={channel}
      />
      <PolarityPicker
        label="Polarity"
        labelOff="Normal"
        labelOn="Inverted"
        onChange={handleChangePolarity}
        value={polarity}
      />

      <ValuePicker
        label="Low"
        onChange={handleChangeCalibrationLow}
        value={calibrationLow}
      />

      <ValuePicker
        label="High"
        onChange={handleChangeCalibrationHigh}
        value={calibrationHigh}
      />
    </>
  )
}

ExpJack.propTypes = {
  ...inputControlShape.isRequired,
  ...inputEventsShape.isRequired,
}

export default ExpJack
