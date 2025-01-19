import { forwardRef, useMemo } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { arraySequence } from '../utils.ts'
import Knob from './Knob'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type KnobPickerProps = SelectProps<number> & {
  highToLow?: boolean
  includeLabel?: boolean
  includePicker?: boolean
  knobProps?: Partial<KnobPickerProps>
  max?: number
  min?: number
  wheelEnabled?: boolean
  wheelSensitivity?: number
  value: number
}

const KnobPicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  KnobPickerProps
>((props, ref) => {
  const {
    disabled,
    highToLow,
    includeLabel,
    includePicker,
    knobProps,
    label,
    max = 127,
    min = 0,
    onChange,
    shrinkLabel,
    value = 0,
    wheelEnabled,
    wheelSensitivity = 0.1,
    ...rest
  } = props

  const options = useMemo(() => {
    const result = arraySequence(max - min + 1)
      .map(i => min + i)
      .map((i): Option<number> => ({ value: i, label: String(i) }))
    return highToLow ? result.reverse() : result
  }, [highToLow, max, min])

  return (
    <div className="zds-pickers__container">
      {Boolean(!shrinkLabel && Boolean(label)) && (
        <span className="zds-pickers__label">{label}</span>
      )}
      <div style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
        {Boolean(includePicker) && (
          <Select
            {...{
              ...rest,
              disabled,
              isDisabled: disabled,
              onChange,
              options,
              ref,
              value,
            }}
          />
        )}

        <Knob
          {...{
            disabled,
            max,
            min,
            onChange,
            value,
            wheelEnabled,
            wheelSensitivity,
            ...knobProps,
          }}
        />
      </div>
    </div>
  )
})

export default KnobPicker

export type { KnobPickerProps }
