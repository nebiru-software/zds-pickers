import { forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { arraySequence, assertRange } from '../utils'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import Select from './Select'

const ValuePicker = forwardRef((props, ref) => {
  const { disabled, highToLow, max, min, onChange, value: initialValue, ...rest } = props
  const options = useMemo(
    () => {
      const result = arraySequence(max - min + 1)
        .map(i => min + i)
        .map(value => ({ value, label: value }))
      return highToLow ? result.reverse() : result
    },
    [highToLow, max, min],
  )

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = useCallback((v) => {
    onChange(assertRange(v, max, min))

    setValue(v)
  }, [max, min, onChange, setValue])

  return (
    <Select
      {...rest}
      disabled={disabled}
      isDisabled={disabled}
      onChange={handleChange}
      options={options}
      ref={ref}
      value={value}
    />
  )
})

ValuePicker.propTypes = {
  disabled: PropTypes.bool,
  highToLow: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
}

ValuePicker.defaultProps = {
  disabled: false,
  highToLow: false,
  max: 127,
  min: 0,
  value: undefined,
}

export default ValuePicker
