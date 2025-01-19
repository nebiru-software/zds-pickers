import cl from 'classnames'
import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { arraySequence } from '../utils.ts'
import Select from './Select'
import type { Option, SelectProps } from './Select'

interface FormatOptionLabelContext {
  context: 'menu' | 'value'
}

type ChannelPickerProps = SelectProps<number>

const options = arraySequence(16).map(value => ({
  value,
  label: `Channel ${value + 1}`,
}))

const formatOptionLabel = (
  option: Option<unknown>,
  { context }: FormatOptionLabelContext,
) =>
  context === 'value' ? option.label : Number.parseInt(String(option.value)) + 1 // menu, e.g. the list of options

const filterOptions = (option: Option<number>, input: string) => {
  // console.log(option, input)

  if (input) {
    return String(option.label).toLowerCase().includes(input.toLowerCase())
  }
  return true
}

const ChannelPicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
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

export type { ChannelPickerProps }
