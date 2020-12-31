import React, { forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

const Select = forwardRef(({ label, onChange, options, value, ...rest }, ref) => {
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
    <div className="zds-pickers__container">
      {Boolean(label) && <span className="zds-pickers__label">{label}</span>}
      <ReactSelect
        classNamePrefix="zds-pickers"
        {...rest}
        onChange={handleChange}
        value={selectedOption}
        options={options}
        ref={ref}
      />
    </div>
  )
})

Select.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.number,
}

Select.defaultProps = {
  label: undefined,
  options: undefined,
  value: undefined,
}

export default Select
