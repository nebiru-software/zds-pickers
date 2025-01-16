import { forwardRef } from 'react'
import ccValues from '../midi/ccValues'
import Select, { type SelectRef } from './Select.tsx'

type Props = {
  onChange: (value: number | string) => void
  value: number
}

const CCPicker = forwardRef<SelectRef, Props>((props, ref) => (
  <Select
    options={ccValues}
    {...props}
    ref={ref}
  />
))

export default CCPicker
