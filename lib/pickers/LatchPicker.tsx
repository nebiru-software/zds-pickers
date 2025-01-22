import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import type { Polarity } from './PolarityPicker'
import { Select } from './Select'
import type { Option, SelectProps } from './Select'

const options: Option<Polarity>[] = [
  { value: 0, label: 'Momentary' },
  { value: 1, label: 'Latching' },
]

type LatchPickerProps = Omit<SelectProps<Polarity>, 'options'>

type LatchPickerRef = SelectInstance<
  Option<Polarity>,
  false,
  GroupBase<Option<Polarity>>
>

const LatchPicker = forwardRef<
  SelectInstance<Option<Polarity>, false, GroupBase<Option<Polarity>>>,
  LatchPickerProps
>((props, ref) => (
  <Select
    {...props}
    options={options}
    ref={ref}
  />
))

export { LatchPicker }

export type { LatchPickerProps, LatchPickerRef }
