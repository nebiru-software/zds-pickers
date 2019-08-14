import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import ccValues from '../midi/ccValues'

const CCPicker = (props) => {
  const { onChange, ...rest } = props

  const dropdownProps = {
    onChange: ({ target }) => onChange(target.value),
    disableUnderline: true,
  }
  return (
    <Select
      {...dropdownProps}
      {...rest}
      options={ccValues}
    />
  )
}

CCPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default CCPicker
