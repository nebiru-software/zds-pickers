import PropTypes from 'prop-types'
import ccValues from '../midi/ccValues'
import Select from './Select'

const CCPicker = props => (
  <Select
    options={ccValues}
    {...props}
  />
)

CCPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default CCPicker
