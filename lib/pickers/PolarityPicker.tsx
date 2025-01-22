import { forwardRef } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { Select } from './Select'
import type { Option, SelectProps } from './Select'

type Polarity = 0 | 1

type PolarityPickerProps = Omit<SelectProps<Polarity>, 'options'> & {
  labelOff?: string
  labelOn?: string
}

type PolarityPickerRef = SelectInstance<
  Option<Polarity>,
  false,
  GroupBase<Option<Polarity>>
>

const PolarityPicker = forwardRef<
  SelectInstance<Option<Polarity>, false, GroupBase<Option<Polarity>>>,
  PolarityPickerProps
>(({ labelOff = 'Normally Off', labelOn = 'Normally On', ...rest }, ref) => {
  const options = [
    { value: 0, label: labelOff },
    { value: 1, label: labelOn },
  ] as Option<Polarity>[]

  return (
    <Select
      {...rest}
      options={options}
      ref={ref}
    />
  )
})

export { PolarityPicker }

export type { Polarity, PolarityPickerProps, PolarityPickerRef }
