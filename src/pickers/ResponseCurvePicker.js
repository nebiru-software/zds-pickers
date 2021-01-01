import PropTypes from 'prop-types'
import { findObj } from '../utils'
import ResponseCurve, { DefaultTooltip, RESPONSE_CURVES } from './ResponseCurve'
import Select from './Select'

const ResponseCurvePicker = (props) => {
  const { Tooltip, inverted, onChange, value, ...rest } = props

  return (
    <Select
      {...rest}
      value={value}
      onChange={onChange}
      components={{
        Placeholder: () => (
          <div className="singleValue">
            {findObj('value', value)(RESPONSE_CURVES)?.label}
          </div>
        ),
        // eslint-disable-next-line react/prop-types
        MenuList: ({ setValue }) => (
          <ResponseCurve
            autosize
            value={value}
            inverted={inverted}
            onChange={({ target: { value: v } }) => {
              setValue(v)
              onChange(v)
            }}
            Tooltip={Tooltip}
          />
        ),
      }}
    />
  )
}

ResponseCurvePicker.propTypes = {
  value: PropTypes.number.isRequired,
  inverted: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  Tooltip: PropTypes.elementType,
}

ResponseCurvePicker.defaultProps = {
  Tooltip: DefaultTooltip,
}

export default ResponseCurvePicker
