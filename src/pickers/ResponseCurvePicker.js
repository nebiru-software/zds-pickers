import PropTypes from 'prop-types'
import React, { forwardRef, useCallback } from 'react'
import { findObj } from '../utils'
import ResponseCurve, { DefaultTooltip, RESPONSE_CURVES } from './ResponseCurve'
import Select from './Select'

const ResponseCurvePicker = forwardRef((props, ref) => {
  const { Tooltip, inverted, onChange, value, ...rest } = props

  const Placeholder = useCallback(() => (
    <div className="singleValue">
      {findObj('value', value)(RESPONSE_CURVES)?.label}
    </div>
  ), [value])

  const MenuList = useCallback(({ setValue }) => (
    <ResponseCurve
      autosize
      inverted={inverted}
      onChange={({ target: { value: v } }) => {
        setValue(v)
        onChange(v)
      }}
      Tooltip={Tooltip}
      value={value}

    />
  ), [Tooltip, inverted, onChange, value])

  return (
    <Select
      {...rest}
      components={{
        Input: () => null,
        Placeholder,
        MenuList,
      }}
      onChange={f => f}
      ref={ref}
      value={value}
    />
  )
})

ResponseCurvePicker.propTypes = {
  value: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  Tooltip: PropTypes.elementType,
}

ResponseCurvePicker.defaultProps = {
  inverted: false,
  Tooltip: DefaultTooltip,
}

export default ResponseCurvePicker
