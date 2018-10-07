import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import classNames from 'classnames'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import CCValues from '../midi/ccValues'

const source = CCValues.map(({ value, label }) => (
  <MenuItem key={value} value={value}>
    {label}
  </MenuItem>
))

const CCPicker = (props) => {
  const { onChange, className } = props
  const passedProps = omit(props, ['onChange', 'className'])

  const dropdownProps = {
    className: classNames(className),
    onChange: ({ target }) => onChange(target.value),
    disableUnderline: true,
  }
  return (
    <Select {...dropdownProps} {...passedProps}>
      {source}
    </Select>
  )
}

CCPicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
}

CCPicker.defaultProps = { className: undefined, autoFocus: false }

export default CCPicker
