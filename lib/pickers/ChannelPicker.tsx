import cl from 'classnames'
import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { arraySequence } from '../utils'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type Channel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15

interface FormatOptionLabelContext {
  context: 'menu' | 'value'
}

type ChannelPickerProps = SelectProps<Channel>

type ChannelPickerRef = SelectInstance<
  Option<Channel>,
  false,
  GroupBase<Option<Channel>>
>

const options: Option<Channel>[] = arraySequence(16).map(value => ({
  value: value as Channel,
  label: `Channel ${value + 1}`,
}))

const formatOptionLabel = (
  option: Option<unknown>,
  { context }: FormatOptionLabelContext,
) =>
  context === 'value' ? option.label : Number.parseInt(String(option.value)) + 1 // menu, e.g. the list of options

const filterOptions = (option: Option<Channel>, input: string) => {
  // console.log(option, input)

  if (input) {
    return String(option.label).toLowerCase().includes(input.toLowerCase())
  }
  return true
}

const ChannelPicker = forwardRef<
  SelectInstance<Option<Channel>, false, GroupBase<Option<Channel>>>,
  ChannelPickerProps
>(({ className, ...rest }, ref) => {
  return (
    <Select
      {...rest}
      className={cl(className, 'channel-picker')}
      filterOptions={filterOptions}
      formatOptionLabel={formatOptionLabel}
      options={options}
      ref={ref}
    />
  )
})

export default ChannelPicker

export type { Channel, ChannelPickerProps, ChannelPickerRef }
