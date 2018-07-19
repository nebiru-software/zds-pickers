import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import Select from '@material-ui/core/Select'

const MappingPicker = (props) => {
  const { onChange, menuSource } = props
  const passedProps = omit(props, ['onChange', 'className', 'menuSource'])

  const dropdownProps = {
    onChange: ({ target }) => onChange(target.value),
    disableUnderline: true,
  }
  return (
    <Select {...dropdownProps} {...passedProps}>
      {menuSource}
    </Select>
  )
}

MappingPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  menuSource: PropTypes.array.isRequired,
}

export default MappingPicker
