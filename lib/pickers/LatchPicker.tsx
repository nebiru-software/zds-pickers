import { forwardRef } from 'react'
import Select from './Select.tsx'
import type { Option, SelectProps, SelectRef } from './Select.tsx'

const options: Option[] = [
  { value: 0, label: 'Momentary' },
  { value: 1, label: 'Latching' },
]

const LatchPicker = forwardRef<SelectRef, SelectProps>((props, ref) => (
  <Select
    {...props}
    options={options}
    ref={ref}
  />
))

export default LatchPicker
