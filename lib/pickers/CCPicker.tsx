import { forwardRef } from 'react'
import ccValues from '../midi/ccValues'
import Select, { type SelectProps, type SelectRef } from './Select.tsx'

type CCPickerProps = SelectProps & {
  onChange: (value: number | string) => void
  value: number
}

const CCPicker = forwardRef<SelectRef, CCPickerProps>((props, ref) => (
  <Select
    {...props}
    options={ccValues}
    ref={ref}
  />
))

export default CCPicker
