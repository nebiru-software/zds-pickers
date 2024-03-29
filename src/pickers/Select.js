import React, { Children, forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactSelect, { components as originalComponents } from 'react-select'
import { compose, omit, set } from '../utils'

const { IndicatorsContainer, Placeholder, ValueContainer } = originalComponents

const CustomIndicatorsContainer = ({ children, ...rest }) => {
  const actionButton = rest.selectProps?.selectProps?.actionButton

  return (
    <IndicatorsContainer {...rest}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        style={{ display: 'flex' }}
      >
        {actionButton}
        {children}
      </div>
    </IndicatorsContainer>
  )
}
CustomIndicatorsContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

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
    components,
    disabled,
    label,
    onChange,
    options,
    preserveMenuWidth,
    shrinkLabel,
    value,
    ...rest
  } = props

  const handleChange = useCallback((option) => {
    onChange(option.value)
  }, [onChange])

  const flatOptionsList = options.reduce((acc, entry) => entry.options
    ? [...acc, ...entry.options]
    : [...acc, entry], [])

  const selectedOption = flatOptionsList.find(option => value === option.value) || undefined

  const styles = useMemo(() => {
    const base = preserveMenuWidth
      ? {
        menu: omit('width'),
        menuList: set('overflowX', 'hidden'),
        option: compose(
          set('whiteSpace', 'nowrap'),
          set('paddingRight', 10),
        ),
      }
      : {}

    return shrinkLabel
      ? {
        ...base,
        container: (provided/* , state */) => ({
          ...provided,
          marginTop: 10,
        }),
        placeholder: (provided, state) => ({
          ...provided,
          position: 'absolute',
          left: state.hasValue || state.selectProps.inputValue ? -2 : '4%',
          top: state.hasValue || state.selectProps.inputValue ? -12 : '50%',
          transition: 'top 0.1s, font-size 0.1s, color 0.1s',
          fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
        }),
        valueContainer: (provided/* , state */) => ({
          ...provided,
          overflow: 'visible',
        }),
      }
      : {
        ...base,
      }
  }, [preserveMenuWidth, shrinkLabel])

  return shrinkLabel
    ? (
      <div className="zds-pickers__container">
        <ReactSelect
          {...rest}
          classNamePrefix="zds-pickers"
          components={{
            IndicatorsContainer: CustomIndicatorsContainer,
            ValueContainer: CustomValueContainer,
            ...components,
          }}
          isDisabled={disabled}
          onChange={handleChange}
          options={options}
          placeholder={label}
          ref={ref}
          styles={styles}
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
          components={{
            IndicatorsContainer: CustomIndicatorsContainer,
            ...components,
          }}
          isDisabled={disabled}
          onChange={handleChange}
          options={options}
          ref={ref}
          styles={styles}
          value={selectedOption}
        />
      </div>
    )
})

Select.propTypes = {
  components: PropTypes.object,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  preserveMenuWidth: PropTypes.bool,
  shrinkLabel: PropTypes.bool,
  value: PropTypes.any, // PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Select.defaultProps = {
  components: undefined,
  disabled: false,
  label: undefined,
  options: [],
  preserveMenuWidth: false,
  shrinkLabel: false,
  value: undefined,
}

export default Select
