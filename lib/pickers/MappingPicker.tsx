import { forwardRef, useMemo } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { getStockNames, getUserMappingNames } from 'zds-mappings'
import { Select } from './Select'
import type { Option, SelectProps } from './Select'

type MappingPickerProps = Omit<SelectProps<string>, 'options'> & {
  allowClearing: boolean
}

type MappingPickerRef = SelectInstance<
  Option<string>,
  false,
  GroupBase<Option<string>>
>

const MappingPicker = forwardRef<
  SelectInstance<Option<string>, false, GroupBase<Option<string>>>,
  MappingPickerProps
>(({ allowClearing, ...rest }, ref) => {
  const stockMappings = getStockNames()
  const userMappings = getUserMappingNames()

  const options = useMemo(() => {
    const result = allowClearing
      ? [
          {
            value: 'No Mapping',
            label: (
              <span className="zds-mappings-clear-mapping">No Mapping</span>
            ),
          },
        ]
      : []

    return [
      ...result,

      {
        label: allowClearing ? <hr /> : '',
        options: userMappings.map(label => ({
          value: label,
          label: <span className="zds-mappings-user-mapping">{label}</span>,
        })),
      },

      {
        label: userMappings.length ? <hr /> : allowClearing ? <hr /> : '',
        options: stockMappings.map(label => ({
          label,
          value: label,
        })),
      },
    ] as Option<string>[]
  }, [allowClearing, stockMappings, userMappings])

  return (
    <Select
      {...rest}
      options={options}
      ref={ref}
    />
  )
})

export { MappingPicker }

export type { MappingPickerProps, MappingPickerRef }
