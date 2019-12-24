import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { mappingShape } from '../shapes'
import { assertRange } from '../utils'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'

const formattedMapEntry = ({ note, name }) => `${note} ${name.length ? '-' : ''} ${name}`
const formattedListEntry = (label, idx) => ({ label, value: idx + 1 })

const NotePicker = (props) => {
  const { channel, disabled, mapping, onChange, status, value: initialValue, ...rest } = props
  const options = mapping.map(formattedMapEntry).map(formattedListEntry)
  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = (event) => {
    const { value: v } = event
    const possibleNoteNumber = assertRange(v, 128, 0)

    if (possibleNoteNumber > 0) {
      onChange(possibleNoteNumber)
    }
    setValue(v)
  }

  return (
    <Select
      isDisabled={disabled}
      options={options}
      value={options[value - 1]}
      onChange={handleChange}
      {...rest}
    />
  )
}

NotePicker.propTypes = {
  mapping: PropTypes.arrayOf(mappingShape).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.number,
  inputRef: PropTypes.any,
  channel: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
}

NotePicker.defaultProps = {
  disabled: false,
  value: undefined,
  inputRef: null,
}

export default NotePicker
