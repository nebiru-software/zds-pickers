import { forwardRef } from 'react'
import Select, { type Option, type SelectProps, type SelectRef } from './Select'

const StatusPicker = forwardRef<
  SelectRef,
  SelectProps & { statuses: Option[] }
>(({ statuses, ...rest }, ref) => (
  <Select
    {...rest}
    options={statuses}
    ref={ref}
  />
))

export default StatusPicker
