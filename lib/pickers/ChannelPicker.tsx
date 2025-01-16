import cl from 'classnames'
import { forwardRef, useCallback } from 'react'
import { arraySequence } from '../utils.ts'
import Select, {
  type Option,
  type SelectProps,
  type SelectRef,
} from './Select.tsx'

const options = arraySequence(16).map(value => ({
  value,
  label: `Channel ${value + 1}`,
}))

const ChannelPicker = forwardRef<SelectRef, SelectProps>(
  ({ className, ...rest }, ref) => {
    interface FormatOptionLabelContext {
      context: 'menu' | 'value'
    }

    const formatOptionLabel: SelectProps['formatOptionLabel'] = useCallback(
      (option: Option, { context }: FormatOptionLabelContext) =>
        context === 'value'
          ? option.label
          : Number.parseInt(String(option.value)) + 1,
      [],
    )
    return (
      <Select
        {...rest}
        className={cl(className, 'channel-picker')}
        formatOptionLabel={formatOptionLabel}
        options={options}
        ref={ref}
      />
    )
  },
)

export default ChannelPicker
