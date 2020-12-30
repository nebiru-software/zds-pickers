import React, { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'

const ValuePicker = forwardRef((props, inputRef) => {
  const { onChange, value: initialValue, ...rest } = props
  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = useCallback(({ target }) => {
    onChange(target.value)
    setValue(target.value)
  }, [onChange, setValue])

  return (
    <input
      ref={inputRef}
      type="number"
      onChange={handleChange}
      onFocus={({ target }) => { target.select() }}
      value={value}
      {...rest}
    />
  )
})

ValuePicker.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
}

ValuePicker.defaultProps = {
  disabled: false,
  value: undefined,
}

export default ValuePicker
