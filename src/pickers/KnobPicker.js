import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { arraySequence } from '../utils'
import Select from './Select'
import Knob from './Knob'

const KnobPicker = forwardRef((props, ref) => {
  const {
    disabled,
    highToLow,
    includePicker,
    label,
    max,
    min,
    shrinkLabel,
    ...rest
  } = props

  const options = useMemo(
    () => {
      const result = arraySequence(max - min + 1)
        .map(i => min + i)
        .map(value => ({ value, label: value }))
      return highToLow ? result.reverse() : result
    },
    [highToLow, max, min],
  )

  return (
    <div className="zds-pickers__container">
      {Boolean(!shrinkLabel && Boolean(label)) && <span className="zds-pickers__label">{label}</span>}
      <div style={{ display: 'inline-flex', gap: 10 }}>
        {Boolean(includePicker) && (
          <Select
            {...rest}
            disabled={disabled}
            isDisabled={disabled}
            options={options}
            ref={ref}
          />
        )}

        <Knob {...{ max, min, ...rest }} />
      </div>
    </div>
  )
})

KnobPicker.propTypes = {
  disabled: PropTypes.bool,
  highToLow: PropTypes.bool,
  includePicker: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  shrinkLabel: PropTypes.bool,
  size: PropTypes.number,
  value: PropTypes.number,
  wheelSensitivity: PropTypes.number,
}

KnobPicker.defaultProps = {
  disabled: false,
  highToLow: false,
  includePicker: false,
  label: undefined,
  max: 127,
  min: 0,
  shrinkLabel: false,
  size: 100,
  value: 0,
  wheelSensitivity: 0.1,
}

export default KnobPicker
