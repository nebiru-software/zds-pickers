import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import Select from './Select'

const PolarityPicker = forwardRef(({ labelOff, labelOn, ...rest }, ref) => {
  const options = [
    { value: 0, label: labelOff },
    { value: 1, label: labelOn },
  ]

  return (
    <Select
      {...rest}
      options={options}
      ref={ref}
    />
  )
})

PolarityPicker.propTypes = {
  labelOff: PropTypes.string,
  labelOn: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

PolarityPicker.defaultProps = {
  labelOn: 'Normally On',
  labelOff: 'Normally Off',
}

export default PolarityPicker
