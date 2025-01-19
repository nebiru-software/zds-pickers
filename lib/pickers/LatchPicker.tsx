import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import Select from './Select'
import type { Option, SelectProps } from './Select'

const options: Option<number>[] = [
  { value: 0, label: 'Momentary' },
  { value: 1, label: 'Latching' },
]

type LatchPickerProps = SelectProps<number>

const LatchPicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  LatchPickerProps
>((props, ref) => (
  <Select
    {...props}
    options={options}
    ref={ref}
  />
))

export default LatchPicker

export type { LatchPickerProps }
