import { forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

const Select = forwardRef(({ disabled, label, onChange, options, value, ...rest }, ref) => {
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
        {...rest}
        classNamePrefix="zds-pickers"
        isDisabled={disabled}
        onChange={handleChange}
        options={options}
        ref={ref}
        value={selectedOption}
      />
    </div>
  )
})

Select.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.any, // PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Select.defaultProps = {
  disabled: false,
  label: undefined,
  options: undefined,
  value: undefined,
}

export default Select
