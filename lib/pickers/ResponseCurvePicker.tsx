import { forwardRef, useCallback } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import DefaultTooltip, { type TooltipProps } from '../other/DefaultTooltip'
import { findObj } from '../utils'
import ResponseCurve, { type Curve, RESPONSE_CURVES } from './ResponseCurve'
import Select from './Select'
import type { Option, SelectProps } from './Select'

type ResponseCurvePickerProps = SelectProps<Curve> & {
  inverted?: boolean
  Tooltip?: React.FC<TooltipProps>
}

type ResponseCurvePickerRef = SelectInstance<
  Option<Curve>,
  false,
  GroupBase<Option<Curve>>
>

const ResponseCurvePicker = forwardRef<
  SelectInstance<Option<Curve>, false, GroupBase<Option<Curve>>>,
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
        {(findObj('value', value)(RESPONSE_CURVES) as Option<Curve>)?.label}
      </div>
    ),
    [value],
  )

  const MenuList = useCallback(
    ({ setValue }: { setValue: (v: Curve) => void }) => (
      <ResponseCurve
        autosize
        inverted={inverted}
        onChange={({ target: { value: v } }) => {
          setValue(v)
          onChange(v)
        }}
        Tooltip={Tooltip}
        value={Number.parseInt(String(value)) as Curve}
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

export type { ResponseCurvePickerProps, ResponseCurvePickerRef }
