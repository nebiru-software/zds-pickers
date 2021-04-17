import { forwardRef, useCallback } from 'react'
import cl from 'classnames'
import PropTypes from 'prop-types'
import NumericInput from 'react-numeric-input2'

const ValuePicker = forwardRef(({ disabled, label, onChange, value, ...rest }, ref) => {
  const handleChange = useCallback(
    (v) => {
      onChange(v)
    },
    [onChange],
  )

  return (
    <div className="zds-pickers__container">
      {Boolean(label) && (
        <span className="zds-pickers__label value-picker__label">
          {label}
        </span>
      )}
      <div
        className={cl({
          'value-picker': true,
          'zds-pickers--is-disabled': disabled,
        })}
        style={{
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="zds-pickers__control"
          style={{
            cursor: 'default',
            display: 'flex',
            transition: 'all 100ms',
          }}
        >
          <div
            className="zds-pickers__value-container"
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: '1',
              flexWrap: 'wrap',
              padding: '2px 8px',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <NumericInput
              {...rest}
              disabled={disabled}
              onChange={handleChange}
              ref={ref}
              value={value}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

ValuePicker.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
}

ValuePicker.defaultProps = {
  disabled: false,
  label: undefined,
  max: 127,
  min: 0,
  value: undefined,
}

export default ValuePicker
