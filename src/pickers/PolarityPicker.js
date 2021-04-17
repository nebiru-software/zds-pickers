import PropTypes from 'prop-types'
import Select from './Select'

const PolarityPicker = ({ labelOff, labelOn, ...rest }) => {
  const options = [
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
