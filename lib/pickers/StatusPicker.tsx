import type { Status } from 'lib/midi/export'
import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type StatusPickerProps = SelectProps<Status> & { statuses: Option<Status>[] }

type StatusPickerRef = SelectInstance<
  Option<Status>,
  false,
  GroupBase<Option<Status>>
>

const StatusPicker = forwardRef<
  SelectInstance<Option<Status>, false, GroupBase<Option<Status>>>,
  StatusPickerProps
>(({ statuses, ...rest }, ref) => (
  <Select<Status>
    {...rest}
    options={statuses}
    ref={ref}
  />
))

export default StatusPicker

export type { StatusPickerProps, StatusPickerRef }
