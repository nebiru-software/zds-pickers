import { CCPicker, ChannelPicker, LatchPicker, PolarityPicker } from 'zds-pickers'
import { inputControlShape, inputEventsShape } from 'core/shapes'

const CCButton = (props) => {
  const {
    channel,
    handleChangeChannel,
    handleChangeLatching,
    handleChangePolarity,
    handleChangeValue,
    latching,
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
      <LatchPicker
        label="Mode"
        onChange={handleChangeLatching}
        value={latching}
      />
      <PolarityPicker
        label="Polarity"
        labelOff={latching ? 'Initially Off' : 'Normally Off'}
        labelOn={latching ? 'Initially On' : 'Normally On'}
        onChange={handleChangePolarity}
        value={polarity}
      />
    </>
  )
}

CCButton.propTypes = {
  ...inputControlShape.isRequired,
  ...inputEventsShape.isRequired,
}

export default CCButton
