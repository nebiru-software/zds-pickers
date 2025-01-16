import { forwardRef } from 'react'
import Select, { type SelectProps, type SelectRef } from './Select.tsx'

type Props = SelectProps & {
  labelOff?: string
  labelOn?: string
}

const PolarityPicker = forwardRef<SelectRef, Props>(
  ({ labelOff = 'Normally Off', labelOn = 'Normally On', ...rest }, ref) => {
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
  },
)

export default PolarityPicker
