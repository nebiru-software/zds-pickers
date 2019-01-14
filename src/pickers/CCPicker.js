import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ccValues from '../midi/ccValues'

const source = ccValues.map(({ value, label }) => (
  <MenuItem
    key={value}
    value={value}
  >
    {label}
  </MenuItem>
))

const CCPicker = (props) => {
  const { onChange, className, ...rest } = props

  const dropdownProps = {
    onChange: ({ target }) => onChange(target.value),
    disableUnderline: true,
  }
  return (
    <Select
      {...dropdownProps}
      {...rest}
    >
      {source}
    </Select>
  )
}

CCPicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
}

CCPicker.defaultProps = { className: undefined, autoFocus: false }

export default CCPicker
