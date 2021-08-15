import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { arraySequence } from '../utils'
import Select from './Select'
import Knob from './Knob'

const KnobPicker = forwardRef((props, ref) => {
  const {
    disabled,
    highToLow,
    includeLabel,
    includePicker,
    knobProps,
    label,
    max,
    min,
    shrinkLabel,
    size,
    wheelSensitivity,
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
      <div style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
        {Boolean(includePicker) && (
          <Select
            {...rest}
            disabled={disabled}
            isDisabled={disabled}
            options={options}
            ref={ref}
          />
        )}

        <Knob
          {...{
            disabled,
            max,
            min,
            size,
            wheelSensitivity,
            ...knobProps,
          }}
        />
      </div>
    </div>
  )
})

KnobPicker.propTypes = {
  disabled: PropTypes.bool,
  highToLow: PropTypes.bool,
  includeLabel: PropTypes.bool,
  includePicker: PropTypes.bool,
  knobProps: PropTypes.object,
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
  includeLabel: true,
  includePicker: false,
  knobProps: undefined,
  label: undefined,
  max: 127,
  min: 0,
  shrinkLabel: false,
  size: 100,
  value: 0,
  wheelSensitivity: 0.1,
}

export default KnobPicker