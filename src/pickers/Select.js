import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

const Select = ({ onChange, options, value, ...rest }) => {
  const handleChange = useCallback((option) => {
    onChange(option.value)
  }, [onChange])

  const selectedOption = useMemo(() => options.find(option => value === option.value), [options, value])

  return (
    <ReactSelect
      classNamePrefix="zds-pickers"
      {...rest}
      onChange={handleChange}
      value={selectedOption}
      options={options}
    />
  )
}

Select.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Select
