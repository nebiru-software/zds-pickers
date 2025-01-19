import { forwardRef, useCallback, useMemo } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import { arraySequence, assertRange } from '../utils.ts'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type ValuePickerProps = SelectProps<number> & {
  highToLow?: boolean
  max?: number
  min?: number
}

const ValuePicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  ValuePickerProps
>((props, ref) => {
  const {
    disabled,
    highToLow,
    max = 127,
    min = 0,
    onChange,
    value: initialValue = 0,
    ...rest
  } = props
  const options = useMemo(() => {
    const result = arraySequence(max - min + 1)
      .map(i => min + i)
      .map(value => ({ value, label: value }))
    return (highToLow
      ? result.reverse()
      : result) as unknown as Option<number>[]
  }, [highToLow, max, min])

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = useCallback(
    (v: number | string) => {
      onChange(assertRange(v, max, min))

      setValue(Number.parseInt(String(v), 10))
    },
    [max, min, onChange, setValue],
  )

  return (
    <Select
      {...rest}
      disabled={disabled}
      onChange={handleChange}
      options={options}
      ref={ref}
      value={value}
    />
  )
})

export default ValuePicker

export type { ValuePickerProps }
