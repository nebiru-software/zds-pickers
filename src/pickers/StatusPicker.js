import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const StatusPicker = (props) => {
  const { className, status, onChange, mini, statuses } = props

  const source = statuses.map(({ value, label }) => (
    <MenuItem
      key={value}
      value={value}
    >
      {label}
    </MenuItem>
  ))

  const dropdownProps = {
    className: classNames(className, {
      mini,
    }),
    onChange: ({ target }) => onChange(target.value),
    value: status,
    disableUnderline: true,
  }
  return <Select {...dropdownProps}>{source}</Select>
}

const statusShape = {
  value: PropTypes.number,
  label: PropTypes.string,
}

StatusPicker.propTypes = {
  className: PropTypes.string,
  status: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  mini: PropTypes.bool,
  statuses: PropTypes.arrayOf(PropTypes.shape(statusShape)).isRequired,
}

StatusPicker.defaultProps = {
  className: '',
  mini: false,
}

export default StatusPicker
