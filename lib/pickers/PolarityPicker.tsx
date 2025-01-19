import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type PolarityPickerProps = SelectProps<number> & {
  labelOff?: string
  labelOn?: string
}

const PolarityPicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  PolarityPickerProps
>(({ labelOff = 'Normally Off', labelOn = 'Normally On', ...rest }, ref) => {
  const options = [
    { value: 0, label: labelOff },
    { value: 1, label: labelOn },
  ]

  return (
    <Select
      {...rest}
      options={options}
      ref={ref}
    />
  )
})

export default PolarityPicker

export type { PolarityPickerProps }
