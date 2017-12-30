import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import CCValues from '../midi/ccValues'
//import { ccPicker, swatch } from '../../styles/ccPicker.scss'

const source = CCValues.map(({ value, label }) => (
  <MenuItem key={value} value={value}>
    {label}
  </MenuItem>
))

const CCPicker = props => {
  const { className, value, onChange, autoFocus } = props
  const dropdownProps = {
    className: classNames(className),
    onChange: ({ target }) => onChange(target.value),
    value,
    autoFocus,
    disableUnderline: true,
  }
  return <Select {...dropdownProps}>{source}</Select>
}

CCPicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
}

CCPicker.defaultProps = { className: undefined, autoFocus: false }

export default CCPicker
