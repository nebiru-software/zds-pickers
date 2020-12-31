import React, { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import NumericInput from 'react-numeric-input2'

const ValuePicker = forwardRef(({ label, onChange, value, ...rest }, ref) => {
  const handleChange = useCallback((option) => {
    onChange(option.value)
  }, [onChange])

  return (
    <div className="zds-pickers__container">
      {Boolean(label) && <span className="zds-pickers__label value-picker__label">{label}</span>}
      <div
        className="value-picker"
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
              onChange={handleChange}
              value={value}
              ref={ref}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

ValuePicker.propTypes = {
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
}

ValuePicker.defaultProps = {
  label: undefined,
  max: 127,
  min: 0,
  value: undefined,
}

export default ValuePicker
