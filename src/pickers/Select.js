import React, { forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

const Select = forwardRef(({ onChange, options, value, ...rest }, ref) => {
  const handleChange = useCallback((option) => {
    onChange(option.value)
  }, [onChange])

  const selectedOption = useMemo(
    () => options && options.find
      ? options?.find(option => value === option.value)
      : undefined,
    [options, value],
  )

  return (
    <ReactSelect
      classNamePrefix="zds-pickers"
      {...rest}
      onChange={handleChange}
      value={selectedOption}
      options={options}
      ref={ref}
    />
  )
})

Select.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
}

Select.defaultProps = {
  value: undefined,
}

export default Select
