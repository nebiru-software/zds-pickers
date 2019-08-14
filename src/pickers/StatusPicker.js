import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const StatusPicker = (statuses, ...rest) => (
  <Select
    options={statuses}
    {...rest}
  />
)

const statusShape = {
  value: PropTypes.number,
  label: PropTypes.string,
}

StatusPicker.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.shape(statusShape)).isRequired,
}

export default StatusPicker
