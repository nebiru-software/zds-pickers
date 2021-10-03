import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'
import Select from './Select'

const StatusPicker = forwardRef(({ statuses, ...rest }, ref) => (
  <Select
    {...rest}
    options={statuses}
    ref={ref}
  />
))

const statusShape = {
  value: PropTypes.number,
  label: PropTypes.string,
}

StatusPicker.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.shape(statusShape)).isRequired,
}

export default StatusPicker
