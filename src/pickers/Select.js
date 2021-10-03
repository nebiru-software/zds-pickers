import React, { Children, forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactSelect, { components } from 'react-select'

const { Placeholder, ValueContainer } = components

const CustomValueContainer = ({ children, ...props }) => (
  <ValueContainer {...props}>
    <Placeholder
      {...props}
      className={props.hasValue || props.selectProps.inputValue ? 'shrunk' : ''}
      isFocused={props.isFocused}
    >
      {props.selectProps.placeholder}
    </Placeholder>
    {Children.map(children, child => child && child.type !== Placeholder ? child : null)}
  </ValueContainer>
)
CustomValueContainer.propTypes = {
  children: PropTypes.node.isRequired,
  hasValue: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool,
  selectProps: PropTypes.object.isRequired,
}
CustomValueContainer.defaultProps = { isFocused: false }

const Select = forwardRef((props, ref) => {
  const {
    disabled,
    label,
    onChange,
    options,
    shrinkLabel,
    value,
    ...rest
  } = props

  const handleChange = useCallback((option) => {
    onChange(option.value)
  }, [onChange])

  const selectedOption = useMemo(
    () => options && options.find
      ? options?.find(option => value === option.value)
      : undefined,
    [options, value],
  )

  return shrinkLabel
    ? (
      <div className="zds-pickers__container">
        <ReactSelect
          {...rest}
          classNamePrefix="zds-pickers"
          components={{
            ValueContainer: CustomValueContainer,
          }}
          isDisabled={disabled}
          onChange={handleChange}
          options={options}
          placeholder={label}
          ref={ref}
          styles={{
            container: (provided/* , state */) => ({
              ...provided,
              marginTop: 10,
            }),
            valueContainer: (provided/* , state */) => ({
              ...provided,
              overflow: 'visible',
            }),
            placeholder: (provided, state) => ({
              ...provided,
              position: 'absolute',
              left: state.hasValue || state.selectProps.inputValue ? -2 : '4%',
              top: state.hasValue || state.selectProps.inputValue ? -12 : '50%',
              transition: 'top 0.1s, font-size 0.1s, color 0.1s',
              fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
            }),
          }}
          value={selectedOption}
        />
      </div>
    )
    : (
      <div className="zds-pickers__container">
        {Boolean(label) && <span className="zds-pickers__label">{label}</span>}
        <ReactSelect
          {...rest}
          classNamePrefix="zds-pickers"
          isDisabled={disabled}
          onChange={handleChange}
          options={options}
          ref={ref}
          value={selectedOption}
        />
      </div>
    )
})

Select.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  shrinkLabel: PropTypes.bool,
  value: PropTypes.any, // PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Select.defaultProps = {
  disabled: false,
  label: undefined,
  options: undefined,
  shrinkLabel: false,
  value: undefined,
}

export default Select
