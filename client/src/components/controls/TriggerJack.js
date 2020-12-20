import { ChannelPicker, NotePicker } from 'zds-pickers'
import { useSelector } from 'react-redux'
import { inputControlShape, inputEventsShape } from 'core/shapes'
import { getMapping } from 'reducers/mappings'
import { stateMappings } from 'selectors/index'

const TriggerJack = (props) => {
  const {
    channel,
    handleChangeChannel,
    handleChangeValue,
    value,
  } = props
  const { channels } = useSelector(stateMappings)

  const mapping = getMapping(channels, channel)

  return (
    <>
      <NotePicker
        channel={channel}
        label="Note #"
        mapping={mapping}
        onChange={handleChangeValue}
        value={value}
      />
      <ChannelPicker
        label="Channel"
        onChange={handleChangeChannel}
        value={channel}
      />
    </>
  )
}

TriggerJack.propTypes = {
  ...inputControlShape.isRequired,
  ...inputEventsShape.isRequired,
}

export default TriggerJack
