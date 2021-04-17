import PropTypes from 'prop-types'
import Select from './Select'

const options = [
  { value: 0, label: 'Momentary' },
  { value: 1, label: 'Latching' },
]

const LatchPicker = props => (
  <Select
    options={options}
    {...props}
  />
)

LatchPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default LatchPicker
