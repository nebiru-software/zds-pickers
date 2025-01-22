import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { changeControllerOptions } from '../midi/ccValues'
import { Select } from './Select'
import type { Option, SelectProps } from './Select'

type CCPickerProps = Omit<SelectProps<number>, 'options'>

type CCPickerRef = SelectInstance<
  Option<number>,
  false,
  GroupBase<Option<number>>
>

const CCPicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  CCPickerProps
>((props, ref) => (
  <Select
    {...props}
    options={changeControllerOptions}
    ref={ref}
  />
))

export { CCPicker }

export type { CCPickerProps, CCPickerRef }
