import cl from 'classnames'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { arraySequence } from '../utils'
import { Select } from './Select'
import type { Option, SelectProps } from './Select'

type InternalValue = number | 'separator'
// type ExternalValue = number

type ChannelMappingOption = Option<InternalValue>

const defaultOptions: ChannelMappingOption[] = arraySequence(16).map(value => ({
  value,
  label: value,
}))

interface ChannelMappingPickerProps
  extends Omit<SelectProps<InternalValue>, 'options'> {
  channels: Option<number>[]
  className?: string
  filterOptions?: (
    candidate: Option<InternalValue>,
    inputValue: string,
  ) => boolean
  value: number
  onChange: (value: InternalValue) => void
}

type ChannelMappingPickerRef = SelectInstance<
  Option<number>,
  false,
  GroupBase<Option<number>>
>

type FormatOptionLabelFunction = NonNullable<
  SelectProps<InternalValue>['formatOptionLabel']
>

const ChannelMappingPicker = forwardRef<
  SelectInstance<
    Option<InternalValue>,
    false,
    GroupBase<Option<InternalValue>>
  >,
  ChannelMappingPickerProps
>(({ channels, className, ...rest }, ref) => {
  const [options, setOptions] = useState<Option<InternalValue>[]>([])

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
    <Select<InternalValue>
      {...rest}
      className={cl(className, 'channel-mapping-picker')}
      formatOptionLabel={formatOptionLabel}
      options={options}
      ref={ref}
    />
  )
})

export { ChannelMappingPicker }

export type {
  ChannelMappingOption,
  ChannelMappingPickerProps,
  ChannelMappingPickerRef,
}
