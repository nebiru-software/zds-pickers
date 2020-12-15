import React from 'react'
import PropTypes from 'prop-types'
import { arraySequence } from '../utils'
import Select from './Select'

const options = arraySequence(16).map(value => ({ value, label: `Channel ${value + 1}` }))

const ChannelPicker = props => (
  <Select
    options={options}
    {...props}
  />
)

ChannelPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default ChannelPicker
