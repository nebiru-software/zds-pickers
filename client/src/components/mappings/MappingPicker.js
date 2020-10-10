import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'

const MappingPicker = (props) => {
  const { className, menuSource, onChange, ...rest } = props

  const dropdownProps = {
    onChange: ({ target }) => onChange(target.value),
    disableUnderline: true,
  }
  return (
    <Select
      {...dropdownProps}
      {...rest}
    >
      {menuSource}
    </Select>
  )
}

MappingPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  menuSource: PropTypes.array.isRequired,
  className: PropTypes.string,
}
MappingPicker.defaultProps = {
  className: null,
}

export default MappingPicker
