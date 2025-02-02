import cl from 'classnames'
import { forwardRef, useCallback } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { arraySequence } from '../utils'
import { Select } from './Select'
import { type Option, type SelectProps, noSelection } from './Select'

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
  | typeof noSelection

interface FormatOptionLabelContext {
  context: 'menu' | 'value'
}

type ChannelPickerProps = Omit<SelectProps<Channel>, 'options'>

type ChannelPickerRef = SelectInstance<
  Option<Channel>,
  false,
  GroupBase<Option<Channel>>
>

const options: Option<Channel>[] = arraySequence(16).map(value => ({
  value: value as Channel,
  label: `Channel ${value + 1}`,
}))

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
>(({ className, value = noSelection, ...rest }, ref) => {
  const formatOptionLabel = useCallback(
    (option: Option<unknown>, { context }: FormatOptionLabelContext) => {
      if (value === undefined) {
        return '--'
      }
      return context === 'value'
        ? option.label
        : Number.parseInt(String(option.value)) + 1 // menu, e.g. the list of options
    },
    [value],
  )

  return (
    <Select
      {...rest}
      className={cl(className, 'channel-picker')}
      filterOptions={filterOptions}
      formatOptionLabel={formatOptionLabel}
      options={options}
      value={value}
      ref={ref}
    />
  )
})

export { ChannelPicker }

export type { Channel, ChannelPickerProps, ChannelPickerRef }
