import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

const PolarityPicker = (props) => {
  const { className, polarity: value, onChange } = props
  const dropdownProps = {
    className,
    onChange: ({ target }) => onChange(target.value),
    value,
    disableUnderline: true,
  }
  return (
    <Select {...dropdownProps}>
      <MenuItem value={0}>Normally Off</MenuItem>
      <MenuItem value={1}>Normally On</MenuItem>
    </Select>
  )
}

PolarityPicker.propTypes = {
  className: PropTypes.string,
  polarity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

PolarityPicker.defaultProps = { className: undefined }

export default PolarityPicker
