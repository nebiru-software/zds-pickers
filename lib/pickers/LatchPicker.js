import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const LatchPicker = (props) => {
  const { className, latching: value, onChange } = props
  const passedProps = omit(props, ['onChange', 'className', 'value', 'classes'])
  const dropdownProps = {
    className,
    onChange: ({ target }) => onChange(target.value),
    value,
    disableUnderline: true,
  }
  return (
    <Select {...dropdownProps} {...passedProps}>
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
