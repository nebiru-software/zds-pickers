import { forwardRef, useCallback } from 'react'
import DefaultTooltip, { type TooltipProps } from '../other/DefaultTooltip'
import { findObj } from '../utils.ts'
import ResponseCurve, { RESPONSE_CURVES } from './ResponseCurve'
import type { GroupBase, SelectInstance } from 'react-select'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type ResponseCurvePickerProps = SelectProps<number> & {
  inverted?: boolean
  Tooltip?: React.FC<TooltipProps>
}

const ResponseCurvePicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  ResponseCurvePickerProps
>((props, ref) => {
  const {
    Tooltip = DefaultTooltip,
    inverted = false,
    onChange,
    value,
    ...rest
  } = props

  const Placeholder = useCallback(
    () => (
      <div className="singleValue">
        {(findObj('value', value)(RESPONSE_CURVES) as Option<number>)?.label}
      </div>
    ),
    [value],
  )

  const MenuList = useCallback(
    ({ setValue }: { setValue: (v: number) => void }) => (
      <ResponseCurve
        autosize
        inverted={inverted}
        onChange={({ target: { value: v } }) => {
          setValue(v)
          onChange(v)
        }}
        Tooltip={Tooltip}
        value={Number.parseInt(String(value))}
      />
    ),
    [Tooltip, inverted, onChange, value],
  )

  return (
    <Select
      {...rest}
      components={{
        Placeholder,
        MenuList,
      }}
      isSearchable={false}
      onChange={f => f}
      ref={ref}
      value={value}
    />
  )
})

export default ResponseCurvePicker

export type { ResponseCurvePickerProps }
