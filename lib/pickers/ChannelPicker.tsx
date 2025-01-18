import cl from 'classnames'
import { forwardRef } from 'react'
import { arraySequence } from '../utils.ts'
import Select, {
  type Option,
  type SelectProps,
  type SelectRef,
} from './Select.tsx'

interface FormatOptionLabelContext {
  context: 'menu' | 'value'
}

const options = arraySequence(16).map(value => ({
  value,
  label: `Channel ${value + 1}`,
}))

const formatOptionLabel: SelectProps['formatOptionLabel'] = (
  option: Option,
  { context }: FormatOptionLabelContext,
) =>
  context === 'value' ? option.label : Number.parseInt(String(option.value)) + 1 // menu, e.g. the list of options

const filterOptions = (option: Option, input: string) => {
  // console.log(option, input)

  if (input) {
    return String(option.label).toLowerCase().includes(input.toLowerCase())
  }
  return true
}

const ChannelPicker = forwardRef<SelectRef, SelectProps>(
  ({ className, ...rest }, ref) => {
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
  },
)

export default ChannelPicker
