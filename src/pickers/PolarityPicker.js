import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const PolarityPicker = (props) => {
  const { labelOn, labelOff, ...rest } = props

  const options = [
    //
    { value: 0, label: labelOff },
    { value: 1, label: labelOn },
  ]

  return (
    <Select
      options={options}
      {...rest}
    />
  )
}

PolarityPicker.propTypes = {
  labelOn: PropTypes.string,
  labelOff: PropTypes.string,
}

PolarityPicker.defaultProps = {
  labelOn: 'Normally On',
  labelOff: 'Normally Off',
}

export default PolarityPicker
