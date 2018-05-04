import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

const PolarityPicker = (props) => {
  const { className, polarity: value, onChange, labelOn, labelOff } = props
  const passedProps = omit(props, [
    'onChange',
    'className',
    'value',
    'classes',
    'labelOn',
    'labelOff',
  ])
  const dropdownProps = {
    className,
    onChange: ({ target }) => onChange(target.value),
    value,
    disableUnderline: true,
  }
  return (
    <Select {...dropdownProps} {...passedProps}>
      <MenuItem value={0}>{labelOff}</MenuItem>
      <MenuItem value={1}>{labelOn}</MenuItem>
    </Select>
  )
}

PolarityPicker.propTypes = {
  className: PropTypes.string,
  polarity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  labelOn: PropTypes.string,
  labelOff: PropTypes.string,
}

PolarityPicker.defaultProps = {
  className: undefined,
  labelOn: 'Normally On',
  labelOff: 'Normally Off',
}

export default PolarityPicker
