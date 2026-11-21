import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import type { Status } from '../midi/export'
import type { Option, SelectProps } from './Select'
import { Select } from './Select'

type StatusPickerProps = Omit<SelectProps<Status>, 'options'> & {
  statuses: Option<Status>[]
}

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

export type { StatusPickerProps, StatusPickerRef }
export { StatusPicker }
