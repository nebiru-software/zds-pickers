import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import Select from './Select'

const ChannelMappingPicker = (props) => {
  const { channels, onChange, value: initialValue, ...rest } = props
  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const options = useMemo(
    () => channels.map((name, channel) => ({
      value: channel,
      label: name
        ? <span className="mapping-entry"><b>{channel + 1}</b> <span className="mapping-entry-label">{name}</span></span>
        : <span className="mapping-entry empty-mapping-entry"><b>{channel + 1}</b> <span className="mapping-entry-label">no mapping</span></span>,
    })),
    [channels],
  )

  const handleChange = useCallback((channel) => {
    setValue(channel)
    onChange(channel)
  }, [onChange, setValue])

  return (
    <Select
      {...rest}
      className="channel-mapping-picker"
      value={options.find(option => option.value === value)}
      onChange={handleChange}
      options={options}
    />
  )
}

ChannelMappingPicker.propTypes = {
  channels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default ChannelMappingPicker
