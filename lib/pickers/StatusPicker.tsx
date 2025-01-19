import type { Status } from 'lib/midi/export'
import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type StatusPickerProps = SelectProps<Status> & { statuses: Option<Status>[] }

const StatusPicker = forwardRef<
  SelectInstance<Option<Status>, false, GroupBase<Option<Status>>>,
  StatusPickerProps
>(({ statuses, ...rest }, ref) => (
  <Select<Status>
    {...rest}
    ref={ref}
  />
))

export default StatusPicker
