import { forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { arraySequence, assertRange } from '../utils'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import Select from './Select'

const ValuePicker = forwardRef((props, ref) => {
  const { disabled, max, min, onChange, value: initialValue, ...rest } = props
  const options = useMemo(() => arraySequence(max - min + 1)
    .map(i => min + i)
    .map(value => ({ value, label: value })), [max, min])

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = useCallback((v) => {
    const possibleNumericNumber = assertRange(v, max, min)

    if (possibleNumericNumber > 0) {
      onChange(possibleNumericNumber)
    }
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
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.number,
}

ValuePicker.defaultProps = {
  disabled: false,
  max: 127,
  min: 0,
  value: undefined,
}

export default ValuePicker
