import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import ccValues from '../midi/ccValues'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type CCPickerProps = SelectProps<number>

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
    options={ccValues}
    ref={ref}
  />
))

export default CCPicker

export type { CCPickerProps, CCPickerRef }
