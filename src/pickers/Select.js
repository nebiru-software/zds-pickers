import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

const Select = ({ onChange, options, value }) => (
  <ReactSelect
    classNamePrefix="zds-pickers"
    onChange={({ target }) => onChange(target.value)}
    value={options.find(option => value === option.value)}
    options={options}
  />
)

Select.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Select
