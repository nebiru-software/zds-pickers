import cl from 'classnames'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { arraySequence } from '../utils.ts'
import Select, {
  type SelectProps,
  type Option,
  type SelectRef,
} from './Select.tsx'

type NumericOption = {
  label: React.ReactNode
  value: number
}

type SeparatorOption = {
  label: React.ReactNode
  value: 'separator'
}

type ChannelMappingOption = NumericOption | SeparatorOption

const defaultOptions: ChannelMappingOption[] = arraySequence(16).map(value => ({
  value,
  label: value,
}))

type Props = SelectProps & {
  channels: Option[]
  className?: string
  onChange: (value: number) => void
  value: number
}

type FormatOptionLabelFunction = NonNullable<SelectProps['formatOptionLabel']>

const ChannelMappingPicker = forwardRef<SelectRef, Props>(
  ({ channels, className, ...rest }, ref) => {
    const [options, setOptions] = useState<Option[]>([])
    const formatOptionLabel: FormatOptionLabelFunction = useCallback(
      ({ value, label }, { context }) => {
        if (value === 'separator') {
          return <span className="zds-mappings-user-mapping">{label}</span>
        }

        if (typeof value !== 'number') return null

        const mapping = channels[value]

        return mapping ? (
          <span className="mapping-entry">
            <b>
              {value + 1}
              {context === 'value' && ' -'}
            </b>
            <span className="mapping-entry-label">{mapping.label}</span>
          </span>
        ) : (
          <span className="mapping-entry empty-mapping-entry">
            <b>
              {value + 1}
              {context === 'value' && ' -'}
            </b>
            <span className="mapping-entry-label">no mapping</span>
          </span>
        )
      },
      [channels],
    )

    useEffect(() => {
      const result = defaultOptions.sort(
        (a: ChannelMappingOption, b: ChannelMappingOption) => {
          if (
            typeof a.value === 'number' &&
            typeof b.value === 'number' &&
            channels[a.value] &&
            !channels[b.value]
          ) {
            return -1
          }

          if (
            typeof a.value === 'number' &&
            typeof b.value === 'number' &&
            !channels[a.value] &&
            channels[b.value]
          ) {
            return 1
          }

          if (typeof a.value === 'number' && typeof b.value === 'number') {
            return a.value - b.value
          }
          return 0
        },
      )

      const numFilled = result.filter(
        ({ value }) => typeof value === 'number' && !!channels[value],
      ).length

      const separatorExists = result.some(({ value }) => value === 'separator')

      if (numFilled && numFilled < 16 && !separatorExists) {
        // insert a separator after the count of filled items
        result.splice(numFilled, 0, { label: <hr />, value: 'separator' })
      }

      setOptions(result)
    }, [channels])

    return (
      <Select
        {...rest}
        className={cl(className, 'channel-mapping-picker')}
        formatOptionLabel={formatOptionLabel}
        options={options}
        ref={ref}
      />
    )
  },
)

export default ChannelMappingPicker
