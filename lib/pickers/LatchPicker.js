import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

const LatchPicker = props => {
  const { className, latching: value, onChange } = props
  const dropdownProps = {
    className,
    onChange: ({ target }) => onChange(target.value),
    value,
    disableUnderline: true,
  }
  return (
    <Select {...dropdownProps}>
      <MenuItem value={1}>Latching</MenuItem>
      <MenuItem value={0}>Momentary</MenuItem>
    </Select>
  )
}

LatchPicker.propTypes = {
  className: PropTypes.string,
  latching: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

LatchPicker.defaultProps = { className: undefined }

export default LatchPicker
