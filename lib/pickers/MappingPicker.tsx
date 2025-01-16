import { forwardRef, useMemo } from 'react'
import { getStockNames, getUserMappingNames } from 'zds-mappings'
import Select, {
  type Option,
  type SelectProps,
  type SelectRef,
} from './Select.tsx'

type MappingPickerProps = SelectProps & {
  allowClearing: boolean
}

const MappingPicker = forwardRef<SelectRef, MappingPickerProps>(
  ({ allowClearing, ...rest }, ref) => {
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
      ] as Option[]
    }, [allowClearing, stockMappings, userMappings])

    return (
      <Select
        {...rest}
        options={options}
        ref={ref}
      />
    )
  },
)

export default MappingPicker
